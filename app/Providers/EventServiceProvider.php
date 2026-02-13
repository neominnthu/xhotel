<?php

namespace App\Providers;

use App\Listeners\DiagnoseHealthListener;
use Illuminate\Foundation\Events\DiagnosingHealth;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        DiagnosingHealth::class => [
            DiagnoseHealthListener::class,
        ],
    ];
}
