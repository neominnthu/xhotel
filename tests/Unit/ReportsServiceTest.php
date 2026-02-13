<?php

namespace Tests\Unit;

use App\Services\ReportsService;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class ReportsServiceTest extends TestCase
{
    public function test_room_nights_expression_uses_sqlite(): void
    {
        if (DB::connection()->getDriverName() !== 'sqlite') {
            $this->markTestSkipped('SQLite driver required for this test.');
        }

        $service = new ReportsService();
        $reflection = new \ReflectionClass($service);
        $method = $reflection->getMethod('roomNightsExpression');
        $method->setAccessible(true);

        $expression = $method->invoke($service);

        $this->assertSame(
            'CAST(julianday(reservations.check_out) - julianday(reservations.check_in) AS INTEGER)',
            $expression
        );
    }
}
