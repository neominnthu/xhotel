<?php

namespace App\Services;

use App\Models\ErrorReport;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class GithubReportService
{
    public function __construct(public GithubTokenService $githubTokenService)
    {
    }

    public function createIssue(ErrorReport $report): array
    {
        if (! config('updates.error_reports.enabled')) {
            throw new RuntimeException('Error reporting is disabled.');
        }

        $owner = config('updates.github.owner');
        $repo = config('updates.github.repo');
        $token = $this->githubTokenService->token();

        if (! $owner || ! $repo || ! $token) {
            throw new RuntimeException('GitHub credentials are missing.');
        }

        $payload = $this->sanitizePayload($report->payload ?? []);
        $body = $this->buildBody($report, $payload);
        $labels = $this->resolveLabels($report->severity);

        $response = Http::withToken($token)
            ->withHeaders([
                'Accept' => 'application/vnd.github+json',
                'User-Agent' => 'XHotel-PMS',
            ])
            ->post("https://api.github.com/repos/{$owner}/{$repo}/issues", [
                'title' => $report->title,
                'body' => $body,
                'labels' => $labels,
            ]);

        if (! $response->successful()) {
            throw new RuntimeException('GitHub issue creation failed.');
        }

        return $response->json();
    }

    private function buildBody(ErrorReport $report, array $payload): string
    {
        $lines = [
            "**Severity:** {$report->severity}",
            "**URL:** ".($report->url ?? 'n/a'),
            "**App Version:** ".($report->app_version ?? 'n/a'),
            "**Trace ID:** ".($report->trace_id ?? 'n/a'),
            "**User ID:** ".($report->user_id ?? 'n/a'),
            '',
            '---',
            '',
            '**Message**',
            $report->message ?? 'n/a',
            '',
            '**Payload**',
            '```json',
            json_encode($payload, JSON_PRETTY_PRINT),
            '```',
        ];

        return implode("\n", $lines);
    }

    private function sanitizePayload(array $payload): array
    {
        $redactKeys = [
            'email',
            'phone',
            'passport',
            'passport_number',
            'id_number',
            'id_card_number',
            'token',
            'access_token',
            'refresh_token',
            'authorization',
            'password',
            'secret',
            'api_key',
        ];

        foreach ($redactKeys as $key) {
            if (Arr::has($payload, $key)) {
                Arr::set($payload, $key, '[redacted]');
            }
        }

        return $payload;
    }

    private function resolveLabels(string $severity): array
    {
        $labels = [
            'error-report',
            'severity:'.$severity,
        ];

        $appLabel = config('updates.github.issue_label');
        if ($appLabel) {
            $labels[] = $appLabel;
        }

        return $labels;
    }
}
