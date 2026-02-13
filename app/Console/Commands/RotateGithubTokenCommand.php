<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class RotateGithubTokenCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'system:github-token-rotate {--token=} {--disk=} {--path=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Rotate and store the GitHub token securely.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $token = $this->option('token');
        $disk = $this->option('disk') ?: config('updates.github.token_disk', 'local');
        $path = $this->option('path') ?: config('updates.github.token_path');

        if (! $token || ! $path) {
            $this->error('Token and path are required.');
            return Command::FAILURE;
        }

        Storage::disk($disk)->put($path, trim($token));

        $this->info('GitHub token stored.');

        return Command::SUCCESS;
    }
}
