<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('stays', function (Blueprint $table) {
            // Guest information
            $table->foreignId('primary_guest_id')->nullable()->constrained('guests')->nullOnDelete()->cascadeOnUpdate();

            // Check-in details
            $table->foreignId('checked_in_by')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();
            $table->timestamp('checked_in_at')->nullable();
            $table->text('check_in_notes')->nullable();

            // Check-out details
            $table->foreignId('checked_out_by')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();
            $table->timestamp('checked_out_at')->nullable();
            $table->text('check_out_notes')->nullable();

            // Room assignment history
            $table->json('room_assignments')->nullable(); // Track room changes during stay

            // Guest count
            $table->integer('adult_count')->default(1);
            $table->integer('child_count')->default(0);

            // Identification documents
            $table->string('id_document_type')->nullable(); // passport, id_card, driving_license
            $table->string('id_document_number')->nullable();
            $table->string('id_document_issued_by')->nullable();
            $table->date('id_document_expiry')->nullable();

            // Security deposit
            $table->decimal('security_deposit_amount', 10, 2)->default(0);
            $table->string('security_deposit_currency', 3)->default('MMK');
            $table->enum('security_deposit_status', ['pending', 'collected', 'refunded', 'forfeited'])->default('pending');

            // Key card information
            $table->string('key_card_number')->nullable();
            $table->timestamp('key_card_issued_at')->nullable();
            $table->timestamp('key_card_returned_at')->nullable();

            // Special requests and preferences
            $table->text('special_requests')->nullable();
            $table->json('guest_preferences')->nullable();

            // Front desk flags
            $table->boolean('early_check_in_requested')->default(false);
            $table->boolean('late_check_out_requested')->default(false);
            $table->timestamp('early_check_in_approved_at')->nullable();
            $table->timestamp('late_check_out_approved_at')->nullable();

            $table->index(['primary_guest_id']);
            $table->index(['checked_in_at']);
            $table->index(['checked_out_at']);
            $table->index(['status']);
        });
    }

    public function down(): void
    {
        Schema::table('stays', function (Blueprint $table) {
            $table->dropForeign(['primary_guest_id']);
            $table->dropForeign(['checked_in_by']);
            $table->dropForeign(['checked_out_by']);

            $table->dropColumn([
                'primary_guest_id',
                'checked_in_by',
                'checked_in_at',
                'check_in_notes',
                'checked_out_by',
                'checked_out_at',
                'check_out_notes',
                'room_assignments',
                'adult_count',
                'child_count',
                'id_document_type',
                'id_document_number',
                'id_document_issued_by',
                'id_document_expiry',
                'security_deposit_amount',
                'security_deposit_currency',
                'security_deposit_status',
                'key_card_number',
                'key_card_issued_at',
                'key_card_returned_at',
                'special_requests',
                'guest_preferences',
                'early_check_in_requested',
                'late_check_out_requested',
                'early_check_in_approved_at',
                'late_check_out_approved_at',
            ]);
        });
    }
};
