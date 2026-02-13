<?php

namespace App\Services;

use App\Jobs\ApplyUpdateJob;
use App\Jobs\RollbackUpdateJob;
use App\Models\Folio;
use App\Models\SystemUpdate;
use App\Models\SystemUpdateLog;
use App\Models\Stay;
use App\Models\User;
use App\Services\GithubTokenService;
use App\Services\SystemHealthService;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use Throwable;
use ZipArchive;

class UpdateService
{
    public function __construct(
        public AuditLogService $auditLogService,
        public BackupService $backupService,
        public GithubTokenService $githubTokenService,
    ) {
    }

    public function checkForUpdates(User $actor, array $payload = []): array
    {
        $currentVersion = config('updates.current_version', '0.0.0');
        $release = $this->fetchLatestRelease();

        return [
            'current_version' => $currentVersion,
            'latest_version' => $release['tag_name'] ?? null,
            'has_update' => ! empty($release['tag_name']) && $release['tag_name'] !== $currentVersion,
            'release' => $release,
        ];
    }

    public function precheckStatus(User $actor): array
    {
        return $this->buildPrecheckReport($actor);
    }

    public function startUpdate(User $actor, array $payload = []): SystemUpdate
    {
        if (! config('updates.enabled')) {
            throw new RuntimeException('Updates are disabled.');
        }

        try {
            $this->ensureNoActiveUpdate();
            $this->ensurePrechecksPass($actor);
        } catch (RuntimeException $exception) {
            $message = $exception->getMessage();

            if ($message === 'UPDATE_IN_PROGRESS') {
                throw $exception;
            }

            throw new RuntimeException('UPDATE_PRECHECK_FAILED:'.$message);
        }

        $release = $this->fetchLatestRelease();
        $versionTo = $payload['version_to'] ?? ($release['tag_name'] ?? null);

        $update = SystemUpdate::create([
            'property_id' => $actor->property_id ?? 1,
            'initiated_by' => $actor->id,
            'status' => 'queued',
            'version_from' => config('updates.current_version', '0.0.0'),
            'version_to' => $versionTo,
            'release_tag' => $payload['release_tag'] ?? ($release['tag_name'] ?? null),
            'release_url' => $release['html_url'] ?? null,
            'meta' => [
                'notes' => $payload['notes'] ?? null,
                'release' => $release,
            ],
        ]);

        $this->logUpdate($update, 'info', 'Update queued.');

        $this->auditLogService->record($actor, 'system.update.started', 'system_update', [
            'update_id' => $update->id,
            'version_from' => $update->version_from,
            'version_to' => $update->version_to,
        ]);

        Log::info('metrics.system.update.started', [
            'update_id' => $update->id,
            'property_id' => $update->property_id,
            'user_id' => $actor->id,
        ]);

        ApplyUpdateJob::dispatch($update->id, $actor->id);

        return $update;
    }

    public function applyUpdate(SystemUpdate $update, User $actor): void
    {
        $update->update([
            'status' => 'running',
            'started_at' => now(),
        ]);

        $this->logUpdate($update, 'info', 'Update started.');

        try {
            $this->logUpdate($update, 'info', 'Creating database backup.');
            $backup = $this->backupService->createBackup($actor, [
                'update_id' => $update->id,
                'version_from' => $update->version_from,
                'version_to' => $update->version_to,
                'source' => 'update',
            ]);

            $update->update([
                'backup_id' => $backup->id,
            ]);
        } catch (Throwable $exception) {
            $this->logUpdate($update, 'error', 'Backup failed.', [
                'error' => $exception->getMessage(),
            ]);
            $this->failUpdate($update, 'UPDATE_BACKUP_FAILED', 'Backup failed.');
            return;
        }

        try {
            $this->logUpdate($update, 'info', 'Resolving update package.');
            $release = $update->meta['release'] ?? $this->fetchLatestRelease();
            $asset = $this->resolveReleaseAsset($release);

            $this->logUpdate($update, 'info', 'Downloading update package.');
            $artifactPath = $this->downloadReleaseAsset($update, $asset);

            $this->logUpdate($update, 'info', 'Verifying update package.');
            $integrityMeta = $this->verifyReleaseIntegrity($update, $release, $artifactPath);

            $this->logUpdate($update, 'info', 'Applying update package.');
            $releaseMeta = $this->applyRelease($update, $artifactPath);

            $combinedMeta = array_filter(array_merge($releaseMeta, $integrityMeta));

            if (! empty($combinedMeta)) {
                $update->update([
                    'meta' => array_merge($update->meta ?? [], $combinedMeta),
                ]);
            }
        } catch (Throwable $exception) {
            $this->logUpdate($update, 'error', 'Update apply failed.', [
                'error' => $exception->getMessage(),
            ]);
            $code = match ($exception->getMessage()) {
                'UPDATE_CHECKSUM_FAILED' => 'UPDATE_CHECKSUM_FAILED',
                'UPDATE_SIGNATURE_FAILED' => 'UPDATE_SIGNATURE_FAILED',
                default => 'UPDATE_APPLY_FAILED',
            };

            $message = match ($code) {
                'UPDATE_CHECKSUM_FAILED' => 'Release checksum verification failed.',
                'UPDATE_SIGNATURE_FAILED' => 'Release signature verification failed.',
                default => 'Update apply failed.',
            };

            $this->failUpdate($update, $code, $message);
            RollbackUpdateJob::dispatch($update->id, $actor->id, false);
            return;
        }

        $this->logUpdate($update, 'info', 'Running health checks.');
        if (! $this->runHealthCheck()) {
            $this->logUpdate($update, 'error', 'Health check failed.');
            $this->failUpdate($update, 'UPDATE_PRECHECK_FAILED', 'Health check failed.');
            RollbackUpdateJob::dispatch($update->id, $actor->id, false);
            return;
        }

        $this->logUpdate($update, 'info', 'Running smoke tests.');
        if (! $this->runSmokeTests($update)) {
            $this->logUpdate($update, 'error', 'Smoke tests failed.');
            $this->failUpdate($update, 'UPDATE_SMOKE_FAILED', 'Smoke tests failed.');
            RollbackUpdateJob::dispatch($update->id, $actor->id, false);
            return;
        }

        $update->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        $this->logUpdate($update, 'info', 'Update completed.');

        $this->auditLogService->record($actor, 'system.update.completed', 'system_update', [
            'update_id' => $update->id,
            'version_from' => $update->version_from,
            'version_to' => $update->version_to,
        ]);

        Log::info('metrics.system.update.completed', [
            'update_id' => $update->id,
            'property_id' => $update->property_id,
            'user_id' => $actor->id,
        ]);
    }

    public function rollbackUpdate(SystemUpdate $update, User $actor, bool $confirmDbRestore = false): void
    {
        $update->update([
            'status' => 'rollback_running',
            'rollback_started_at' => now(),
        ]);

        $this->logUpdate($update, 'info', 'Rollback started.');

        try {
            if ($update->backup && $confirmDbRestore) {
                $this->logUpdate($update, 'info', 'Restoring database backup.');
                $this->backupService->restoreBackup($update->backup, $actor);
            }

            if (config('updates.deploy_mode') === 'swap') {
                $this->logUpdate($update, 'info', 'Restoring previous release.');
                $this->restorePreviousRelease($update);
            }

            $update->update([
                'status' => 'rolled_back',
                'rollback_completed_at' => now(),
            ]);

            $this->logUpdate($update, 'info', 'Rollback completed.');
        } catch (Throwable $exception) {
            $update->update([
                'status' => 'rollback_failed',
                'failed_at' => now(),
                'error_code' => 'ROLLBACK_FAILED',
                'error_message' => $exception->getMessage(),
            ]);

            $this->logUpdate($update, 'error', 'Rollback failed.', [
                'error' => $exception->getMessage(),
            ]);

            throw $exception;
        }

        $this->auditLogService->record($actor, 'system.rollback.completed', 'system_update', [
            'update_id' => $update->id,
            'version_from' => $update->version_from,
            'version_to' => $update->version_to,
        ]);

        Log::info('metrics.system.rollback.completed', [
            'update_id' => $update->id,
            'property_id' => $update->property_id,
            'user_id' => $actor->id,
        ]);
    }

    private function ensureNoActiveUpdate(): void
    {
        $active = SystemUpdate::query()
            ->whereIn('status', ['queued', 'running', 'rollback_running'])
            ->exists();

        if ($active) {
            throw new RuntimeException('UPDATE_IN_PROGRESS');
        }
    }

    private function fetchLatestRelease(): array
    {
        $owner = config('updates.github.owner');
        $repo = config('updates.github.repo');
        $token = $this->githubTokenService->token();

        if (! $owner || ! $repo) {
            return [];
        }

        $response = Http::withToken($token)
            ->withHeaders(['Accept' => 'application/vnd.github+json'])
            ->get("https://api.github.com/repos/{$owner}/{$repo}/releases/latest");

        if (! $response->successful()) {
            return [];
        }

        return $response->json();
    }

    private function resolveReleaseAsset(array $release): array
    {
        $assetName = config('updates.github.release_asset');
        $assets = $release['assets'] ?? [];

        foreach ($assets as $asset) {
            if (($asset['name'] ?? null) === $assetName) {
                return $asset;
            }
        }

        throw new RuntimeException('Update package not found.');
    }

    private function resolveReleaseAssetByName(array $release, ?string $assetName): ?array
    {
        if (! $assetName) {
            return null;
        }

        $assets = $release['assets'] ?? [];

        foreach ($assets as $asset) {
            if (($asset['name'] ?? null) === $assetName) {
                return $asset;
            }
        }

        return null;
    }

    private function downloadReleaseAsset(SystemUpdate $update, array $asset): string
    {
        $disk = config('updates.backup_disk', 'local');
        $targetDir = "system/updates/{$update->id}";
        $target = $targetDir.'/'.($asset['name'] ?? 'release.zip');
        $downloadUrl = $asset['browser_download_url'] ?? null;

        if (! $downloadUrl) {
            throw new RuntimeException('Release download URL missing.');
        }

        $response = Http::withToken($this->githubTokenService->token())
            ->withHeaders(['Accept' => 'application/octet-stream'])
            ->get($downloadUrl);

        if (! $response->successful()) {
            throw new RuntimeException('Failed to download update package.');
        }

        Storage::disk($disk)->put($target, $response->body());

        return Storage::disk($disk)->path($target);
    }

    private function verifyReleaseIntegrity(SystemUpdate $update, array $release, string $artifactPath): array
    {
        $meta = [];
        $checksumAsset = $this->resolveReleaseAssetByName(
            $release,
            config('updates.github.checksum_asset')
        );

        if ($checksumAsset) {
            $checksumPath = $this->downloadReleaseAsset($update, $checksumAsset);
            $expected = trim((string) file_get_contents($checksumPath));
            $actual = hash_file('sha256', $artifactPath);

            $meta['checksum'] = [
                'expected' => $expected,
                'actual' => $actual,
            ];

            if (! $expected || ! hash_equals($expected, $actual)) {
                throw new RuntimeException('UPDATE_CHECKSUM_FAILED');
            }
        }

        $publicKeyPath = config('updates.github.signature_public_key_path');
        $signatureAsset = $this->resolveReleaseAssetByName(
            $release,
            config('updates.github.signature_asset')
        );

        if ($publicKeyPath && $signatureAsset) {
            $signaturePath = $this->downloadReleaseAsset($update, $signatureAsset);
            $publicKey = file_get_contents($publicKeyPath);
            $signature = file_get_contents($signaturePath);
            $payload = file_get_contents($artifactPath);

            $meta['signature'] = [
                'public_key_path' => $publicKeyPath,
                'asset' => $signatureAsset['name'] ?? null,
            ];

            if (! $publicKey || ! $signature || ! $payload) {
                throw new RuntimeException('UPDATE_SIGNATURE_FAILED');
            }

            $verified = openssl_verify($payload, $signature, $publicKey, OPENSSL_ALGO_SHA256);
            if ($verified !== 1) {
                throw new RuntimeException('UPDATE_SIGNATURE_FAILED');
            }
        }

        return $meta;
    }

    private function applyRelease(SystemUpdate $update, string $artifactPath): array
    {
        if (config('updates.deploy_mode') !== 'swap') {
            return [];
        }

        $releasePath = rtrim(config('updates.release_path', base_path('releases')), '/');
        $currentPath = rtrim(config('updates.current_path', base_path()), '/');
        $version = $update->version_to ?? 'release-'.$update->id;
        $targetPath = $releasePath.'/'.$version;

        if (is_dir($targetPath)) {
            $targetPath .= '-'.$update->id;
        }

        if (! is_dir($releasePath) && ! mkdir($releasePath, 0755, true) && ! is_dir($releasePath)) {
            throw new RuntimeException('Unable to create releases directory.');
        }

        $zip = new ZipArchive();
        if ($zip->open($artifactPath) !== true) {
            throw new RuntimeException('Unable to open update package.');
        }

        $zip->extractTo($targetPath);
        $zip->close();

        $phpBinary = config('updates.php_binary', 'php');
        $composerBinary = config('updates.composer_binary', 'composer');

        $this->runReleaseCommand($targetPath, [$composerBinary, 'install', '--no-dev', '--no-interaction', '--prefer-dist', '--optimize-autoloader']);
        $this->runReleaseCommand($targetPath, [$phpBinary, 'artisan', 'migrate', '--force']);
        $this->runReleaseCommand($targetPath, [$phpBinary, 'artisan', 'config:clear']);
        $this->runReleaseCommand($targetPath, [$phpBinary, 'artisan', 'cache:clear']);
        $this->runReleaseCommand($targetPath, [$phpBinary, 'artisan', 'storage:link']);

        $previousPath = null;

        if (is_link($currentPath)) {
            $previousPath = readlink($currentPath) ?: null;
            unlink($currentPath);

            if (! symlink($targetPath, $currentPath)) {
                throw new RuntimeException('Unable to swap release symlink.');
            }
        }

        return [
            'deploy' => [
                'current_path' => $currentPath,
                'previous_path' => $previousPath,
                'release_path' => $targetPath,
            ],
        ];
    }

    private function restorePreviousRelease(SystemUpdate $update): void
    {
        $deploy = $update->meta['deploy'] ?? [];
        $currentPath = $deploy['current_path'] ?? rtrim(config('updates.current_path', base_path()), '/');
        $previousPath = $deploy['previous_path']
            ?? config('updates.previous_path')
            ?? null;

        if (! $previousPath || ! is_dir($previousPath)) {
            throw new RuntimeException('Previous release is not available.');
        }

        if (is_link($currentPath)) {
            unlink($currentPath);
        }

        if (! symlink($previousPath, $currentPath)) {
            throw new RuntimeException('Unable to restore previous release.');
        }
    }

    private function runHealthCheck(): bool
    {
        $url = config('updates.health_check_url') ?: url('/up');

        $response = Http::timeout(10)->get($url);

        return $response->successful();
    }

    private function runSmokeTests(SystemUpdate $update): bool
    {
        if (! config('updates.smoke_tests.enabled', true)) {
            return true;
        }

        $phpBinary = config('updates.php_binary', 'php');
        $currentPath = rtrim(config('updates.current_path', base_path()), '/');

        $result = Process::path($currentPath)
            ->timeout(300)
            ->run([$phpBinary, 'artisan', 'system:smoke-test', '--no-interaction']);

        if (! $result->successful()) {
            $this->logUpdate($update, 'error', 'Smoke test command failed.', [
                'output' => $result->output(),
                'error' => $result->errorOutput(),
            ]);
        }

        return $result->successful();
    }

    private function runReleaseCommand(string $path, array $command): void
    {
        $result = Process::path($path)->timeout(300)->run($command);

        if (! $result->successful()) {
            throw new RuntimeException($result->errorOutput() ?: 'Release command failed.');
        }
    }

    private function ensurePrechecksPass(User $actor): void
    {
        $report = $this->buildPrecheckReport($actor);

        if ($report['active_stays']) {
            throw new RuntimeException('Active check-ins exist.');
        }

        if ($report['open_folios']) {
            throw new RuntimeException('Open folios exist.');
        }

        if ($report['has_unhealthy']) {
            throw new RuntimeException('Health checks failed.');
        }
    }

    private function buildPrecheckReport(User $actor): array
    {
        $propertyId = $actor->property_id;

        $activeUpdate = SystemUpdate::query()
            ->whereIn('status', ['queued', 'running', 'rollback_running'])
            ->exists();

        $activeStays = Stay::query()
            ->where('status', 'checked_in')
            ->when($propertyId, fn ($query) => $query->whereHas('reservation', fn ($q) => $q->where('property_id', $propertyId)))
            ->exists();

        $openFolios = Folio::query()
            ->where('status', 'open')
            ->when($propertyId, fn ($query) => $query->whereHas('reservation', fn ($q) => $q->where('property_id', $propertyId)))
            ->exists();

        $health = app(SystemHealthService::class)->checks();
        $hasUnhealthy = collect($health)->contains(fn ($status) => $status !== 'healthy');

        return [
            'active_update' => $activeUpdate,
            'active_stays' => $activeStays,
            'open_folios' => $openFolios,
            'health' => $health,
            'has_unhealthy' => $hasUnhealthy,
        ];
    }

    private function logUpdate(SystemUpdate $update, string $level, string $message, array $context = []): void
    {
        SystemUpdateLog::create([
            'system_update_id' => $update->id,
            'level' => $level,
            'message' => $message,
            'context' => $context,
            'created_at' => now(),
        ]);

        Log::info('metrics.system.update.log', [
            'update_id' => $update->id,
            'property_id' => $update->property_id,
            'level' => $level,
            'message' => $message,
            'context' => $context,
        ]);
    }

    private function failUpdate(SystemUpdate $update, string $code, string $message): void
    {
        $update->update([
            'status' => 'failed',
            'failed_at' => now(),
            'error_code' => $code,
            'error_message' => $message,
        ]);

        $this->logUpdate($update, 'error', $message, ['error_code' => $code]);

        $actor = $update->initiatedBy()->first();
        if ($actor) {
            $this->auditLogService->record($actor, 'system.update.failed', 'system_update', [
                'update_id' => $update->id,
                'error_code' => $code,
            ]);
        }

        Log::info('metrics.system.update.failed', [
            'update_id' => $update->id,
            'property_id' => $update->property_id,
            'error_code' => $code,
        ]);
    }
}
