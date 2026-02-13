<?php

namespace App\Listeners;

use App\Services\SystemHealthService;
use Illuminate\Foundation\Events\DiagnosingHealth;

class DiagnoseHealthListener
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(DiagnosingHealth $event): void
    {
        app(SystemHealthService::class)->assertHealthy();
    }
}
