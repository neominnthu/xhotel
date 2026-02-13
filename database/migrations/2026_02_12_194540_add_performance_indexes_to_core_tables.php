<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Reservations table - additional performance indexes
        Schema::table('reservations', function (Blueprint $table) {
            // Composite indexes for common queries
            $table->index(['property_id', 'check_in'], 'reservations_property_check_in_idx');
            $table->index(['property_id', 'check_out'], 'reservations_property_check_out_idx');
            $table->index(['property_id', 'status', 'check_in'], 'reservations_property_status_check_in_idx');
            $table->index(['guest_id', 'check_in'], 'reservations_guest_check_in_idx');
            $table->index(['room_id', 'check_in'], 'reservations_room_check_in_idx');
            $table->index(['status', 'check_in'], 'reservations_status_check_in_idx');
            $table->index(['status', 'check_out'], 'reservations_status_check_out_idx');
        });

        // Stays table - performance indexes
        Schema::table('stays', function (Blueprint $table) {
            $table->index(['status'], 'stays_status_idx');
            $table->index(['actual_check_in'], 'stays_actual_check_in_idx');
            $table->index(['actual_check_out'], 'stays_actual_check_out_idx');
            $table->index(['status', 'actual_check_in'], 'stays_status_check_in_idx');
            $table->index(['assigned_room_id'], 'stays_assigned_room_idx');
        });

        // Folios table - additional indexes
        Schema::table('folios', function (Blueprint $table) {
            $table->index(['reservation_id', 'status'], 'folios_reservation_status_idx');
            $table->index(['status', 'balance'], 'folios_status_balance_idx');
            $table->index(['closed_at'], 'folios_closed_at_idx');
        });

        // Payments table - additional indexes
        Schema::table('payments', function (Blueprint $table) {
            $table->index(['folio_id', 'received_at'], 'payments_folio_received_at_idx');
            $table->index(['method', 'received_at'], 'payments_method_received_at_idx');
            $table->index(['created_by', 'received_at'], 'payments_created_by_received_at_idx');
        });

        // Charges table - performance indexes
        Schema::table('charges', function (Blueprint $table) {
            $table->index(['folio_id', 'created_at'], 'charges_folio_created_at_idx');
            $table->index(['type', 'created_at'], 'charges_type_created_at_idx');
        });

        // Housekeeping tasks - performance indexes
        Schema::table('housekeeping_tasks', function (Blueprint $table) {
            $table->index(['room_id', 'status'], 'housekeeping_room_status_idx');
            $table->index(['assigned_to', 'status'], 'housekeeping_assigned_status_idx');
            $table->index(['status', 'created_at'], 'housekeeping_status_created_at_idx');
            $table->index(['priority', 'status'], 'housekeeping_priority_status_idx');
        });

        // Room status logs - performance indexes
        Schema::table('room_status_logs', function (Blueprint $table) {
            $table->index(['room_id', 'created_at'], 'room_status_logs_room_created_at_idx');
            $table->index(['status', 'created_at'], 'room_status_logs_status_created_at_idx');
        });

        // Reservation status logs - performance indexes
        Schema::table('reservation_status_logs', function (Blueprint $table) {
            $table->index(['reservation_id', 'changed_at'], 'reservation_status_logs_reservation_changed_at_idx');
            $table->index(['changed_by', 'changed_at'], 'reservation_status_logs_changed_by_changed_at_idx');
        });

        // Guests table - additional indexes
        Schema::table('guests', function (Blueprint $table) {
            // Add vip_status column if it doesn't exist
            if (!Schema::hasColumn('guests', 'vip_status')) {
                $table->enum('vip_status', ['regular', 'vip', 'vvip'])->default('regular');
            }
            $table->index(['property_id', 'created_at'], 'guests_property_created_at_idx');
            $table->index(['vip_status'], 'guests_vip_status_idx');
            $table->index(['nationality'], 'guests_nationality_idx');
        });

        // Rooms table - additional indexes
        Schema::table('rooms', function (Blueprint $table) {
            $table->index(['room_type_id', 'status'], 'rooms_room_type_status_idx');
            $table->index(['floor', 'status'], 'rooms_floor_status_idx');
        });
    }

    public function down(): void
    {
        // Drop all added indexes in reverse order
        Schema::table('rooms', function (Blueprint $table) {
            $table->dropIndex('rooms_floor_status_idx');
            $table->dropIndex('rooms_room_type_status_idx');
        });

        Schema::table('guests', function (Blueprint $table) {
            $table->dropIndex('guests_nationality_idx');
            $table->dropIndex('guests_vip_status_idx');
            $table->dropIndex('guests_property_created_at_idx');
            // Drop vip_status column if it exists
            if (Schema::hasColumn('guests', 'vip_status')) {
                $table->dropColumn('vip_status');
            }
        });

        Schema::table('reservation_status_logs', function (Blueprint $table) {
            $table->dropIndex('reservation_status_logs_changed_by_changed_at_idx');
            $table->dropIndex('reservation_status_logs_reservation_changed_at_idx');
        });

        Schema::table('room_status_logs', function (Blueprint $table) {
            $table->dropIndex('room_status_logs_status_created_at_idx');
            $table->dropIndex('room_status_logs_room_created_at_idx');
        });

        Schema::table('housekeeping_tasks', function (Blueprint $table) {
            $table->dropIndex('housekeeping_priority_status_idx');
            $table->dropIndex('housekeeping_status_created_at_idx');
            $table->dropIndex('housekeeping_assigned_status_idx');
            $table->dropIndex('housekeeping_room_status_idx');
        });

        Schema::table('charges', function (Blueprint $table) {
            $table->dropIndex('charges_type_created_at_idx');
            $table->dropIndex('charges_folio_created_at_idx');
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->dropIndex('payments_created_by_received_at_idx');
            $table->dropIndex('payments_method_received_at_idx');
            $table->dropIndex('payments_folio_received_at_idx');
        });

        Schema::table('folios', function (Blueprint $table) {
            $table->dropIndex('folios_closed_at_idx');
            $table->dropIndex('folios_status_balance_idx');
            $table->dropIndex('folios_reservation_status_idx');
        });

        Schema::table('stays', function (Blueprint $table) {
            $table->dropIndex('stays_assigned_room_idx');
            $table->dropIndex('stays_status_check_in_idx');
            $table->dropIndex('stays_actual_check_out_idx');
            $table->dropIndex('stays_actual_check_in_idx');
            $table->dropIndex('stays_status_idx');
        });

        Schema::table('reservations', function (Blueprint $table) {
            $table->dropIndex('reservations_status_check_out_idx');
            $table->dropIndex('reservations_status_check_in_idx');
            $table->dropIndex('reservations_room_check_in_idx');
            $table->dropIndex('reservations_guest_check_in_idx');
            $table->dropIndex('reservations_property_status_check_in_idx');
            $table->dropIndex('reservations_property_check_out_idx');
            $table->dropIndex('reservations_property_check_in_idx');
        });
    }
};
