<?php

namespace App\Services;

use App\Models\RoomType;
use App\Models\User;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;
use SplFileObject;

class ReservationImportService
{
    public function __construct(public ReservationService $reservationService)
    {
    }

    public function import(SplFileObject $file, User $actor): array
    {
        $file->setFlags(SplFileObject::READ_CSV | SplFileObject::SKIP_EMPTY | SplFileObject::DROP_NEW_LINE);
        $file->setCsvControl(',');

        $header = $file->fgetcsv();
        $header = $this->normalizeHeader($header);

        $required = [
            'guest_name',
            'guest_phone',
            'guest_email',
            'check_in',
            'check_out',
            'room_type_id',
            'adults',
            'children',
            'source',
            'special_requests',
        ];

        foreach ($required as $column) {
            if (! in_array($column, $header, true)) {
                throw new HttpResponseException(response()->json([
                    'code' => 'IMPORT_MISSING_COLUMN',
                    'message' => "Missing required column: {$column}.",
                ], 422));
            }
        }

        $results = [
            'created' => 0,
            'failed' => 0,
            'errors' => [],
        ];

        $rowNumber = 1;

        foreach ($file as $row) {
            $rowNumber++;

            if (! is_array($row) || count($row) === 1 && $row[0] === null) {
                continue;
            }

            if ($rowNumber === 2 && $this->normalizeHeader($row) === $header) {
                continue;
            }

            $rowData = $this->mapRow($header, $row);

            $validator = Validator::make($rowData, [
                'guest_name' => ['required', 'string', 'max:120'],
                'guest_phone' => ['nullable', 'string', 'max:32'],
                'guest_email' => ['nullable', 'email', 'max:120'],
                'check_in' => ['required', 'date', 'after_or_equal:today'],
                'check_out' => ['required', 'date', 'after:check_in'],
                'room_type_id' => ['required', 'integer', 'exists:room_types,id'],
                'adults' => ['required', 'integer', 'min:1', 'max:10'],
                'children' => ['nullable', 'integer', 'min:0', 'max:10'],
                'source' => ['required', 'in:walk_in,phone,ota,corporate'],
                'special_requests' => ['nullable', 'string', 'max:500'],
            ]);

            if ($validator->fails()) {
                $results['failed']++;
                $results['errors'][] = [
                    'row' => $rowNumber,
                    'errors' => $validator->errors()->toArray(),
                ];
                continue;
            }

            $validated = $validator->validated();
            $roomType = RoomType::find($validated['room_type_id']);

            if (! $roomType) {
                $results['failed']++;
                $results['errors'][] = [
                    'row' => $rowNumber,
                    'errors' => ['room_type_id' => ['Room type not found.']],
                ];
                continue;
            }

            try {
                $this->reservationService->create([
                    'property_id' => $actor->property_id ?? 1,
                    'guest' => [
                        'name' => $validated['guest_name'],
                        'phone' => $validated['guest_phone'] ?? null,
                        'email' => $validated['guest_email'] ?? null,
                    ],
                    'check_in' => $validated['check_in'],
                    'check_out' => $validated['check_out'],
                    'room_type_id' => $validated['room_type_id'],
                    'adults' => (int) $validated['adults'],
                    'children' => (int) ($validated['children'] ?? 0),
                    'source' => $validated['source'],
                    'special_requests' => $validated['special_requests'] ?? null,
                    'currency' => $actor->property?->default_currency ?? 'MMK',
                ], $actor);

                $results['created']++;
            } catch (\Throwable $exception) {
                $results['failed']++;
                $results['errors'][] = [
                    'row' => $rowNumber,
                    'errors' => ['reservation' => [$exception->getMessage()]],
                ];
            }
        }

        return $results;
    }

    private function normalizeHeader(?array $header): array
    {
        if (! $header) {
            return [];
        }

        return array_values(array_map(function ($value) {
            return strtolower(trim((string) $value));
        }, $header));
    }

    private function mapRow(array $header, array $row): array
    {
        if (count($row) === 1 && is_string($row[0]) && str_contains($row[0], ',')) {
            $row = str_getcsv($row[0]);
        }

        $row = array_pad($row, count($header), null);

        return Arr::mapWithKeys($header, function ($key, $index) use ($row) {
            return [$key => $row[$index] !== null ? trim((string) $row[$index]) : null];
        });
    }
}
