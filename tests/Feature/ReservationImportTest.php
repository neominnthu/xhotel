<?php

namespace Tests\Feature;

use App\Models\Property;
use App\Models\Reservation;
use App\Models\RoomType;
use App\Models\Room;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class ReservationImportTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_import_reservations_from_csv(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-02-12 10:00:00'));

        $property = Property::factory()->create();
        $roomType = RoomType::factory()->create([
            'property_id' => $property->id,
        ]);

        Room::factory()->create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'status' => 'available',
        ]);

        $user = User::factory()->create([
            'role' => 'reservation_manager',
            'property_id' => $property->id,
        ]);

        $path = tempnam(sys_get_temp_dir(), 'csv');
        $handle = fopen($path, 'w');
        fputcsv($handle, [
            'guest_name',
            'guest_phone',
            'guest_email',
            'check_in',
            'check_out',
            'room_type_id',
            'adults',
            'children',
            'source',
            'special_requests',
        ]);
        fputcsv($handle, [
            'John Doe',
            '959123456789',
            'john@example.com',
            '2026-02-13',
            '2026-02-14',
            (string) $roomType->id,
            '2',
            '0',
            'walk_in',
            'Import test',
        ]);
        fclose($handle);

        $file = new UploadedFile($path, 'reservations.csv', 'text/csv', null, true);

        $response = $this->actingAs($user)->post('/api/v1/reservations/import', [
            'file' => $file,
        ]);

        @unlink($path);

        $response->assertOk();
        $response->assertJson([
            'created' => 1,
            'failed' => 0,
        ]);

        $this->assertDatabaseCount('reservations', 1);
        $reservation = Reservation::first();
        $this->assertEquals($roomType->id, $reservation->room_type_id);
    }
}
