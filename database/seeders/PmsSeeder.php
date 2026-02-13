<?php

namespace Database\Seeders;

use App\Models\ExchangeRate;
use App\Models\Folio;
use App\Models\Guest;
use App\Models\Property;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\Stay;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class PmsSeeder extends Seeder
{
    public function run(): void
    {
        $property = Property::firstOrCreate([
            'name' => 'XHotel Yangon',
        ], [
            'timezone' => 'Asia/Yangon',
            'default_currency' => 'MMK',
            'default_language' => 'my',
            'phone' => '959000000000',
        ]);

        ExchangeRate::updateOrCreate([
            'property_id' => $property->id,
            'base_currency' => $property->default_currency,
            'quote_currency' => 'USD',
            'effective_date' => now()->toDateString(),
        ], [
            'rate' => 3500,
            'source' => 'seed',
            'is_active' => true,
        ]);

        $users = [
            ['name' => 'Admin', 'email' => 'admin@hotel.com', 'role' => 'admin'],
            ['name' => 'Front Desk', 'email' => 'fd@hotel.com', 'role' => 'front_desk'],
            ['name' => 'Reservation Manager', 'email' => 'rm@hotel.com', 'role' => 'reservation_manager'],
            ['name' => 'Housekeeping', 'email' => 'hk@hotel.com', 'role' => 'housekeeping'],
            ['name' => 'Cashier', 'email' => 'cs@hotel.com', 'role' => 'cashier'],
        ];

        foreach ($users as $user) {
            User::updateOrCreate([
                'email' => $user['email'],
            ], [
                'name' => $user['name'],
                'password' => Hash::make('password'),
                'role' => $user['role'],
                'department' => $user['role'],
                'property_id' => $property->id,
                'is_active' => true,
            ]);
        }

        $standard = RoomType::updateOrCreate([
            'property_id' => $property->id,
            'name' => ['my' => 'Standard', 'en' => 'Standard'],
        ], [
            'capacity' => 2,
            'base_rate' => 60000,
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $deluxe = RoomType::updateOrCreate([
            'property_id' => $property->id,
            'name' => ['my' => 'Deluxe', 'en' => 'Deluxe'],
        ], [
            'capacity' => 2,
            'base_rate' => 90000,
            'sort_order' => 2,
            'is_active' => true,
        ]);

        $rooms = [
            ['number' => '101', 'room_type_id' => $standard->id, 'status' => 'available'],
            ['number' => '102', 'room_type_id' => $standard->id, 'status' => 'occupied'],
            ['number' => '201', 'room_type_id' => $deluxe->id, 'status' => 'out_of_order'],
            ['number' => '202', 'room_type_id' => $deluxe->id, 'status' => 'available'],
        ];

        foreach ($rooms as $room) {
            Room::updateOrCreate([
                'property_id' => $property->id,
                'number' => $room['number'],
            ], [
                'room_type_id' => $room['room_type_id'],
                'status' => $room['status'],
                'housekeeping_status' => 'clean',
                'is_active' => true,
            ]);
        }

        $guestA = Guest::updateOrCreate([
            'name' => 'Aye Aye',
            'phone' => '959123456',
        ]);

        $guestB = Guest::updateOrCreate([
            'name' => 'Min Min',
            'phone' => '959555555',
        ]);

        $reservation1 = Reservation::updateOrCreate([
            'code' => 'RSV-20260212-001',
        ], [
            'property_id' => $property->id,
            'guest_id' => $guestA->id,
            'status' => 'confirmed',
            'source' => 'walk_in',
            'check_in' => now()->toDateString(),
            'check_out' => now()->addDay()->toDateString(),
            'room_type_id' => $deluxe->id,
            'adults' => 2,
            'children' => 0,
        ]);

        $reservation2 = Reservation::updateOrCreate([
            'code' => 'RSV-20260212-002',
        ], [
            'property_id' => $property->id,
            'guest_id' => $guestB->id,
            'status' => 'confirmed',
            'source' => 'phone',
            'check_in' => now()->toDateString(),
            'check_out' => now()->addDays(2)->toDateString(),
            'room_type_id' => $standard->id,
            'room_id' => Room::where('number', '102')->first()?->id,
            'adults' => 1,
            'children' => 0,
        ]);

        $reservation3 = Reservation::updateOrCreate([
            'code' => 'RSV-20260212-003',
        ], [
            'property_id' => $property->id,
            'guest_id' => $guestA->id,
            'status' => 'checked_in',
            'source' => 'ota',
            'check_in' => now()->toDateString(),
            'check_out' => now()->addDays(2)->toDateString(),
            'room_type_id' => $standard->id,
            'room_id' => Room::where('number', '101')->first()?->id,
            'adults' => 2,
            'children' => 0,
        ]);

        $reservation4 = Reservation::updateOrCreate([
            'code' => 'RSV-20260212-004',
        ], [
            'property_id' => $property->id,
            'guest_id' => $guestB->id,
            'status' => 'checked_out',
            'source' => 'corporate',
            'check_in' => now()->subDays(3)->toDateString(),
            'check_out' => now()->subDay()->toDateString(),
            'room_type_id' => $deluxe->id,
            'room_id' => Room::where('number', '202')->first()?->id,
            'adults' => 2,
            'children' => 0,
        ]);

        Stay::updateOrCreate([
            'reservation_id' => $reservation3->id,
        ], [
            'status' => 'checked_in',
            'assigned_room_id' => $reservation3->room_id,
            'actual_check_in' => now()->subHours(2),
        ]);

        Stay::updateOrCreate([
            'reservation_id' => $reservation4->id,
        ], [
            'status' => 'checked_out',
            'assigned_room_id' => $reservation4->room_id,
            'actual_check_in' => now()->subDays(3),
            'actual_check_out' => now()->subDay(),
        ]);

        foreach ([$reservation1, $reservation2, $reservation3, $reservation4] as $reservation) {
            Folio::updateOrCreate([
                'reservation_id' => $reservation->id,
            ], [
                'currency' => 'MMK',
                'total' => 0,
                'balance' => 0,
                'status' => $reservation->status === 'checked_out' ? 'closed' : 'open',
                'closed_at' => $reservation->status === 'checked_out' ? now()->subDay() : null,
            ]);
        }
    }
}
