<?php

namespace Tests\Concerns;

use Illuminate\Support\Facades\Log;

trait AssertsLoggedMetrics
{
    /**
     * Expect a metrics log entry with a channel/message and optional payload subset.
     */
    protected function expectMetricLogged(string $message, array $subset = null): void
    {
        $expectation = Log::shouldReceive('info')->once()->withArgs(function ($msg, $data) use ($message, $subset) {
            if ($msg !== $message) {
                return false;
            }

            if ($subset === null) {
                return true;
            }

            if (! is_array($data)) {
                return false;
            }

            foreach ($subset as $k => $v) {
                if (! array_key_exists($k, $data) || $data[$k] !== $v) {
                    return false;
                }
            }

            return true;
        });

        // keep reference to expectation so Mockery doesn't garbage collect early
        $this->addToAssertionCount(0);
    }
}
