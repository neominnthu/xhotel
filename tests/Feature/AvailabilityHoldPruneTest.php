<?php

namespace Tests\Feature;

use App\Models\AvailabilityHold;
use App\Models\Property;
use App\Models\RoomType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Tests\TestCase;

class AvailabilityHoldPruneTest extends TestCase
{
    use RefreshDatabase;

    public function test_prune_command_deletes_expired_holds(): void
    {
        $property = Property::factory()->create();
        $roomType = RoomType::factory()->create([
            'property_id' => $property->id,
        ]);

        $expiredHold = AvailabilityHold::factory()->create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'expires_at' => now()->subMinute(),
        ]);

        $activeHold = AvailabilityHold::factory()->create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'expires_at' => now()->addMinutes(10),
        ]);

        Artisan::call('availability-holds:prune');

        $this->assertSoftDeleted('availability_holds', [
            'id' => $expiredHold->id,
        ]);
        $this->assertDatabaseHas('availability_holds', [
            'id' => $activeHold->id,
        ]);
    }
}
