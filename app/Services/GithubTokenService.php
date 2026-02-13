<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

class GithubTokenService
{
    public function token(): ?string
    {
        $disk = config('updates.github.token_disk', 'local');
        $path = config('updates.github.token_path');

        if ($path && Storage::disk($disk)->exists($path)) {
            $token = trim((string) Storage::disk($disk)->get($path));
            return $token !== '' ? $token : null;
        }

        return config('updates.github.token');
    }
}
