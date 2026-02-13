<?php

namespace Tests\Unit;

use App\Services\GithubTokenService;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class GithubTokenServiceTest extends TestCase
{
    public function test_reads_token_from_storage_when_available(): void
    {
        Storage::fake('local');
        config([
            'updates.github.token_disk' => 'local',
            'updates.github.token_path' => 'system/secrets/github-token',
            'updates.github.token' => 'env-token',
        ]);

        Storage::disk('local')->put('system/secrets/github-token', 'file-token');

        $token = app(GithubTokenService::class)->token();

        $this->assertSame('file-token', $token);
    }

    public function test_falls_back_to_env_token_when_storage_missing(): void
    {
        Storage::fake('local');
        config([
            'updates.github.token_disk' => 'local',
            'updates.github.token_path' => 'system/secrets/github-token',
            'updates.github.token' => 'env-token',
        ]);

        $token = app(GithubTokenService::class)->token();

        $this->assertSame('env-token', $token);
    }
}
