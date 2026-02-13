<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Tests\Concerns\AuditTestHelpers;

abstract class TestCase extends BaseTestCase
{
    use AuditTestHelpers;
}
