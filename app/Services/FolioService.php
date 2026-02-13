<?php

namespace App\Services;

use App\Models\Charge;
use App\Models\Folio;
use App\Models\Payment;
use App\Models\Refund;
use App\Models\User;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\DB;

class FolioService
{
    public function __construct(
        public AuditLogService $auditLogService,
        public ExchangeRateService $exchangeRateService
    ) {}

    public function addCharge(Folio $folio, array $data, User $actor): Charge
    {
        $this->reopenIfClosed($folio);

        if ($data['currency'] !== $folio->currency) {
            throw new HttpResponseException(response()->json([
                'code' => 'FOLIO_CURRENCY_MISMATCH',
                'message' => 'Charge currency must match folio currency.',
            ], 409));
        }

        return DB::transaction(function () use ($folio, $data, $actor) {
            $amount = (int) $data['amount'];
            $taxAmount = (int) ($data['tax_amount'] ?? 0);
            $total = $amount + $taxAmount;

            $charge = Charge::create([
                'folio_id' => $folio->id,
                'type' => $data['type'],
                'amount' => $amount,
                'currency' => $data['currency'],
                'tax_amount' => $taxAmount,
                'description' => $data['description'] ?? null,
                'posted_at' => now(),
                'created_by' => $actor->id,
            ]);

            $folio->increment('total', $total);
            $folio->increment('balance', $total);

            $this->auditLogService->record($actor, 'folio.charge.created', 'folio', [
                'folio_id' => $folio->id,
                'charge_id' => $charge->id,
                'amount' => $amount,
                'tax_amount' => $taxAmount,
                'currency' => $data['currency'],
            ]);

            return $charge->fresh();
        });
    }

    public function addPayment(Folio $folio, array $data, User $actor): Payment
    {
        $this->guardFolioIsOpen($folio);

        $exchangeRate = $data['exchange_rate'] ?? null;
        $currency = $data['currency'];

        if ($currency !== $folio->currency && $exchangeRate === null) {
            $exchangeRate = $this->exchangeRateService->resolveRate(
                $folio->reservation?->property_id ?? $actor->property_id,
                $folio->currency,
                $currency,
                now(),
            );
        }

        if ($currency !== $folio->currency && $exchangeRate === null) {
            throw new HttpResponseException(response()->json([
                'code' => 'FOLIO_CURRENCY_MISMATCH',
                'message' => 'Exchange rate required for non-folio currency.',
            ], 409));
        }

        return DB::transaction(function () use ($folio, $data, $actor, $currency, $exchangeRate) {
            $amount = (int) $data['amount'];
            $folioAmount = $amount;

            if ($currency !== $folio->currency) {
                $folioAmount = (int) round($amount * (float) $exchangeRate);
            }

            $payment = Payment::create([
                'folio_id' => $folio->id,
                'method' => $data['method'],
                'amount' => $amount,
                'currency' => $currency,
                'exchange_rate' => $exchangeRate ?? 1,
                'reference' => $data['reference'] ?? null,
                'card_last_four' => $data['card_last_four'] ?? null,
                'card_type' => $data['card_type'] ?? null,
                'bank_details' => $data['bank_details'] ?? null,
                'wallet_type' => $data['wallet_type'] ?? null,
                'check_number' => $data['check_number'] ?? null,
                'received_at' => now(),
                'created_by' => $actor->id,
            ]);

            $newBalance = $folio->balance - $folioAmount;
            $folio->balance = max($newBalance, 0);

            if ($folio->balance === 0) {
                $folio->status = 'closed';
                $folio->closed_at = now();
            }

            $folio->save();

            $this->auditLogService->record($actor, 'folio.payment.created', 'folio', [
                'folio_id' => $folio->id,
                'payment_id' => $payment->id,
                'amount' => $amount,
                'folio_amount' => $folioAmount,
                'currency' => $currency,
                'exchange_rate' => $exchangeRate,
            ]);

            return $payment->fresh();
        });
    }

    public function requestRefund(Folio $folio, array $data, User $actor): Refund
    {
        $exchangeRate = $data['exchange_rate'] ?? null;
        $currency = $data['currency'];

        if ($currency !== $folio->currency && $exchangeRate === null) {
            $exchangeRate = $this->exchangeRateService->resolveRate(
                $folio->reservation?->property_id ?? $actor->property_id,
                $folio->currency,
                $currency,
                now(),
            );
        }

        if ($currency !== $folio->currency && $exchangeRate === null) {
            throw new HttpResponseException(response()->json([
                'code' => 'FOLIO_CURRENCY_MISMATCH',
                'message' => 'Exchange rate required for non-folio currency.',
            ], 409));
        }

        return DB::transaction(function () use ($folio, $data, $actor, $currency, $exchangeRate) {
            $amount = (int) $data['amount'];
            $folioAmount = $amount;

            if ($currency !== $folio->currency) {
                $folioAmount = (int) round($amount * (float) $exchangeRate);
            }

            $availableRefund = $this->calculateAvailableRefund($folio);

            if ($folioAmount > $availableRefund) {
                throw new HttpResponseException(response()->json([
                    'code' => 'FOLIO_REFUND_EXCEEDS_PAID',
                    'message' => 'Refund amount exceeds available paid balance.',
                ], 409));
            }

            $refund = Refund::create([
                'folio_id' => $folio->id,
                'payment_id' => $data['payment_id'] ?? null,
                'method' => $data['method'],
                'amount' => $amount,
                'currency' => $currency,
                'exchange_rate' => $exchangeRate ?? 1,
                'folio_amount' => $folioAmount,
                'status' => 'pending',
                'reference' => $data['reference'] ?? null,
                'reason' => $data['reason'] ?? null,
                'requested_by' => $actor->id,
            ]);

            $this->auditLogService->record($actor, 'folio.refund.requested', 'folio', [
                'folio_id' => $folio->id,
                'refund_id' => $refund->id,
                'amount' => $amount,
                'folio_amount' => $folioAmount,
                'currency' => $currency,
                'exchange_rate' => $exchangeRate,
            ]);

            return $refund->fresh();
        });
    }

    public function approveRefund(Refund $refund, User $actor, ?string $reference = null): Refund
    {
        if ($refund->status !== 'pending') {
            throw new HttpResponseException(response()->json([
                'code' => 'FOLIO_REFUND_STATUS_INVALID',
                'message' => 'Refund status must be pending for approval.',
            ], 409));
        }

        return DB::transaction(function () use ($refund, $actor, $reference) {
            $folio = $refund->folio()->lockForUpdate()->first();

            if (! $folio) {
                throw new HttpResponseException(response()->json([
                    'code' => 'FOLIO_NOT_FOUND',
                    'message' => 'Folio not found for refund.',
                ], 404));
            }

            $availableRefund = $this->calculateAvailableRefund($folio, $refund->id);

            if ($refund->folio_amount > $availableRefund) {
                throw new HttpResponseException(response()->json([
                    'code' => 'FOLIO_REFUND_EXCEEDS_PAID',
                    'message' => 'Refund amount exceeds available paid balance.',
                ], 409));
            }

            $refund->fill([
                'status' => 'approved',
                'approved_by' => $actor->id,
                'approved_at' => now(),
                'refunded_at' => now(),
                'reference' => $reference ?? $refund->reference,
            ]);
            $refund->save();

            $folio->balance = $folio->balance + $refund->folio_amount;

            if ($folio->balance > 0) {
                $folio->status = 'open';
                $folio->closed_at = null;
            }

            $folio->save();

            $this->auditLogService->record($actor, 'folio.refund.approved', 'folio', [
                'folio_id' => $folio->id,
                'refund_id' => $refund->id,
                'folio_amount' => $refund->folio_amount,
                'currency' => $refund->currency,
            ]);

            return $refund->fresh();
        });
    }

    private function guardFolioIsOpen(Folio $folio): void
    {
        if ($folio->status !== 'open') {
            throw new HttpResponseException(response()->json([
                'code' => 'FOLIO_CLOSED',
                'message' => 'Folio is closed.',
            ], 409));
        }
    }

    private function reopenIfClosed(Folio $folio): void
    {
        if ($folio->status === 'closed') {
            $folio->update([
                'status' => 'open',
                'closed_at' => null,
            ]);
        }
    }

    private function calculateAvailableRefund(Folio $folio, ?int $excludeRefundId = null): int
    {
        $paidTotal = Payment::query()
            ->where('folio_id', $folio->id)
            ->get(['amount', 'exchange_rate'])
            ->sum(fn (Payment $payment) => (int) round($payment->amount * (float) $payment->exchange_rate));

        $refundQuery = Refund::query()
            ->where('folio_id', $folio->id)
            ->whereIn('status', ['pending', 'approved']);

        if ($excludeRefundId) {
            $refundQuery->where('id', '!=', $excludeRefundId);
        }

        $refundedTotal = (int) $refundQuery->sum('folio_amount');

        return max($paidTotal - $refundedTotal, 0);
    }
}
