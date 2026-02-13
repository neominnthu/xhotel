<?php

namespace Tests\Unit\Policies;

use App\Models\Property;
use App\Models\Rate;
use App\Models\RoomType;
use App\Models\User;
use App\Policies\RatePolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RatePolicyTest extends TestCase
{
    use RefreshDatabase;

    private RatePolicy $policy;

    protected function setUp(): void
    {
        parent::setUp();
        $this->policy = new RatePolicy();
    }

    public function test_delete_allows_admin_same_property(): void
    {
        $property = Property::factory()->create();
        $roomType = RoomType::factory()->create(['property_id' => $property->id]);
        $rate = Rate::factory()->create(['property_id' => $property->id, 'room_type_id' => $roomType->id]);
        $user = User::factory()->create(['role' => 'admin', 'property_id' => $property->id]);

        $this->assertTrue($this->policy->delete($user, $rate));
    }

    public function test_delete_allows_reservation_manager_same_property(): void
    {
        $property = Property::factory()->create();
        $roomType = RoomType::factory()->create(['property_id' => $property->id]);
        $rate = Rate::factory()->create(['property_id' => $property->id, 'room_type_id' => $roomType->id]);
        $user = User::factory()->create(['role' => 'reservation_manager', 'property_id' => $property->id]);

        $this->assertTrue($this->policy->delete($user, $rate));
    }

    public function test_delete_denies_front_desk(): void
    {
        $property = Property::factory()->create();
        $roomType = RoomType::factory()->create(['property_id' => $property->id]);
        $rate = Rate::factory()->create(['property_id' => $property->id, 'room_type_id' => $roomType->id]);
        $user = User::factory()->create(['role' => 'front_desk', 'property_id' => $property->id]);

        $this->assertFalse($this->policy->delete($user, $rate));
    }

    public function test_delete_denies_different_property(): void
    {
        $property1 = Property::factory()->create();
        $property2 = Property::factory()->create();
        $roomType = RoomType::factory()->create(['property_id' => $property1->id]);
        $rate = Rate::factory()->create(['property_id' => $property1->id, 'room_type_id' => $roomType->id]);
        $user = User::factory()->create(['role' => 'admin', 'property_id' => $property2->id]);

        $this->assertFalse($this->policy->delete($user, $rate));
    }

    public function test_delete_allows_null_property_user(): void
    {
        $property = Property::factory()->create();
        $roomType = RoomType::factory()->create(['property_id' => $property->id]);
        $rate = Rate::factory()->create(['property_id' => $property->id, 'room_type_id' => $roomType->id]);
        $user = User::factory()->create(['role' => 'admin', 'property_id' => null]);

        $this->assertTrue($this->policy->delete($user, $rate));
    }
}
