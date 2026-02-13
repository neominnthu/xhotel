<?php

namespace App\Services;

use App\Models\Folio;
use App\Models\Payment;
use App\Models\Refund;
use App\Models\User;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\DB;

class RefundService
{
    public function __construct(public AuditLogService $auditLogService) {}

    public function requestRefund(Folio $folio, array $data, User $actor): Refund
    {
        if ($folio->balance > 0) {
            throw new HttpResponseException(response()->json([
                'code' => 'FOLIO_BALANCE_MISMATCH',
                'message' => 'Folio balance must be zero before refunds.',
            ], 409));
        }

        $exchangeRate = $data['exchange_rate'] ?? null;
        $currency = $data['currency'];

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

            $paidTotal = $folio->payments
                ->sum(fn ($payment) => $payment->currency === $folio->currency
                    ? $payment->amount
                    : (int) round($payment->amount * (float) $payment->exchange_rate));

            $approvedRefunds = $folio->refunds()
                ->where('status', 'approved')
                ->sum('folio_amount');

            $maxRefundable = max(0, $paidTotal - $approvedRefunds);

            if (! empty($data['payment_id'])) {
                $payment = Payment::query()->find($data['payment_id']);

                if (! $payment || $payment->folio_id !== $folio->id) {
                    throw new HttpResponseException(response()->json([
                        'code' => 'FOLIO_REFUND_PAYMENT_MISMATCH',
                        'message' => 'Refund payment does not belong to folio.',
                    ], 409));
                }
            }

            if ($folioAmount > $maxRefundable) {
                throw new HttpResponseException(response()->json([
                    'code' => 'FOLIO_REFUND_EXCEEDS_PAID',
                    'message' => 'Refund exceeds paid amount.',
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
                'currency' => $currency,
                'folio_amount' => $folioAmount,
            ]);

            return $refund->fresh();
        });
    }

    public function approveRefund(Refund $refund, array $data, User $actor): Refund
    {
        if ($refund->status !== 'pending') {
            throw new HttpResponseException(response()->json([
                'code' => 'REFUND_STATUS_INVALID',
                'message' => 'Refund is not pending approval.',
            ], 409));
        }

        return DB::transaction(function () use ($refund, $data, $actor) {
            $refund->fill([
                'status' => 'approved',
                'approved_at' => now(),
                'approved_by' => $actor->id,
                'reference' => $data['reference'] ?? $refund->reference,
                'refunded_at' => now(),
            ]);
            $refund->save();

            $this->auditLogService->record($actor, 'folio.refund.approved', 'folio', [
                'folio_id' => $refund->folio_id,
                'refund_id' => $refund->id,
                'folio_amount' => $refund->folio_amount,
                'status' => $refund->status,
            ]);

            return $refund->fresh();
        });
    }
}
