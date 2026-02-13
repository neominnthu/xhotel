<?php

namespace App\Services;

use App\Models\Charge;
use App\Models\Folio;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\DB;

class FolioService
{
    public function __construct(public AuditLogService $auditLogService)
    {
    }

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
}
