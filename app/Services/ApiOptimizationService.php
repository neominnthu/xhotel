<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection as SupportCollection;

class ApiOptimizationService
{
    /**
     * Optimize database queries with eager loading and constraints.
     */
    public function optimizeQuery(Builder $query, array $includes = [], array $constraints = []): Builder
    {
        // Apply eager loading
        if (!empty($includes)) {
            $query->with($includes);
        }

        // Apply constraints for performance
        foreach ($constraints as $constraint => $value) {
            switch ($constraint) {
                case 'limit':
                    $query->limit($value);
                    break;
                case 'order_by':
                    if (is_array($value)) {
                        $query->orderBy($value[0], $value[1] ?? 'asc');
                    }
                    break;
                case 'where_date_range':
                    if (isset($value['field'], $value['start'], $value['end'])) {
                        $query->whereBetween($value['field'], [$value['start'], $value['end']]);
                    }
                    break;
                case 'select_fields':
                    if (is_array($value)) {
                        $query->select($value);
                    }
                    break;
            }
        }

        return $query;
    }

    /**
     * Format API response with consistent structure and metadata.
     */
    public function formatResponse(
        mixed $data,
        string $message = null,
        int $statusCode = 200,
        array $metadata = []
    ): JsonResponse {
        $response = [
            'success' => $statusCode >= 200 && $statusCode < 300,
            'data' => $data,
        ];

        if ($message) {
            $response['message'] = $message;
        }

        // Add pagination metadata if data is paginated
        if ($data instanceof LengthAwarePaginator) {
            $response['meta'] = [
                'current_page' => $data->currentPage(),
                'per_page' => $data->perPage(),
                'total' => $data->total(),
                'last_page' => $data->lastPage(),
                'from' => $data->firstItem(),
                'to' => $data->lastItem(),
            ];
        }

        // Add custom metadata
        if (!empty($metadata)) {
            $response['meta'] = array_merge($response['meta'] ?? [], $metadata);
        }

        return response()->json($response, $statusCode);
    }

    /**
     * Apply request-based filtering and sorting to queries.
     */
    public function applyRequestFilters(Builder $query, Request $request, array $allowedFilters = [], array $allowedSorts = []): Builder
    {
        // Apply filters
        foreach ($allowedFilters as $filter) {
            if ($request->has($filter)) {
                $value = $request->input($filter);

                // Handle different filter types
                if (str_contains($filter, '_id')) {
                    $query->where($filter, $value);
                } elseif (in_array($filter, ['status', 'type', 'state'])) {
                    $query->where($filter, $value);
                } elseif (str_contains($filter, '_date') || str_contains($filter, 'date_')) {
                    $query->whereDate($filter, $value);
                } else {
                    $query->where($filter, 'like', "%{$value}%");
                }
            }
        }

        // Apply sorting
        if ($request->has('sort_by') && in_array($request->input('sort_by'), $allowedSorts)) {
            $sortDirection = $request->input('sort_direction', 'asc');
            $query->orderBy($request->input('sort_by'), $sortDirection);
        }

        // Apply pagination
        if ($request->has('per_page')) {
            $perPage = min((int) $request->input('per_page', 15), 100); // Max 100 per page
            return $query->paginate($perPage);
        }

        return $query;
    }

    /**
     * Transform collection data for API responses.
     */
    public function transformCollection(Collection|SupportCollection $collection, callable $transformer = null): SupportCollection
    {
        if ($transformer) {
            return $collection->map($transformer);
        }

        // Default transformation - remove sensitive fields
        return $collection->map(function ($item) {
            if ($item instanceof Model) {
                $data = $item->toArray();

                // Remove sensitive fields
                unset($data['password'], $data['remember_token'], $data['api_token']);

                // Convert timestamps to ISO format
                foreach (['created_at', 'updated_at', 'deleted_at'] as $timestamp) {
                    if (isset($data[$timestamp])) {
                        $data[$timestamp] = $item->$timestamp?->toISOString();
                    }
                }

                return $data;
            }

            return $item;
        });
    }

    /**
     * Generate cache key for API responses.
     */
    public function generateCacheKey(Request $request, array $additionalParams = []): string
    {
        $key = 'api:' . $request->path();

        // Include query parameters
        $queryParams = $request->query();
        ksort($queryParams);
        if (!empty($queryParams)) {
            $key .= ':' . http_build_query($queryParams);
        }

        // Include additional parameters
        if (!empty($additionalParams)) {
            ksort($additionalParams);
            $key .= ':' . http_build_query($additionalParams);
        }

        // Include user ID if authenticated
        if ($request->user()) {
            $key .= ':user=' . $request->user()->id;
        }

        return $key;
    }

    /**
     * Compress response data for large payloads.
     */
    public function compressResponse(array $data): array
    {
        // Remove null values
        $data = $this->removeNullValues($data);

        // Compress nested arrays
        $data = $this->compressNestedArrays($data);

        return $data;
    }

    /**
     * Remove null values from arrays recursively.
     */
    private function removeNullValues(array $data): array
    {
        foreach ($data as $key => $value) {
            if ($value === null) {
                unset($data[$key]);
            } elseif (is_array($value)) {
                $data[$key] = $this->removeNullValues($value);
            }
        }

        return $data;
    }

    /**
     * Compress nested arrays by removing redundant structure.
     */
    private function compressNestedArrays(array $data): array
    {
        // This is a placeholder for more complex compression logic
        // For now, just return the data as-is
        return $data;
    }
}
