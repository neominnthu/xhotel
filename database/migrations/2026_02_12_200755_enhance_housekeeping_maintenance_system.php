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
        Schema::table('housekeeping_tasks', function (Blueprint $table) {
            // Enhanced priority system
            $table->enum('priority', ['low', 'normal', 'high', 'urgent', 'critical'])->default('normal')->change();

            // Maintenance-specific fields
            $table->string('maintenance_category')->nullable()->after('type'); // plumbing, electrical, hvac, structural, etc.
            $table->text('maintenance_description')->nullable()->after('maintenance_category');
            $table->string('reported_by_name')->nullable()->after('maintenance_description');
            $table->string('reported_by_contact')->nullable()->after('reported_by_name');
            $table->json('maintenance_photos')->nullable()->after('reported_by_contact'); // URLs to uploaded photos
            $table->decimal('estimated_cost', 10, 2)->nullable()->after('maintenance_photos');
            $table->string('approved_by')->nullable()->after('estimated_cost');
            $table->timestamp('approved_at')->nullable()->after('approved_by');
            $table->string('vendor_assigned')->nullable()->after('approved_at');
            $table->decimal('actual_cost', 10, 2)->nullable()->after('vendor_assigned');
            $table->text('resolution_notes')->nullable()->after('actual_cost');

            $table->index(['type', 'maintenance_category', 'priority']);
            $table->index(['approved_at', 'approved_by']);
        });
    }

    public function down(): void
    {
        Schema::table('housekeeping_tasks', function (Blueprint $table) {
            $table->enum('priority', ['low', 'normal', 'high'])->default('normal')->change();

            $table->dropColumn([
                'maintenance_category',
                'maintenance_description',
                'reported_by_name',
                'reported_by_contact',
                'maintenance_photos',
                'estimated_cost',
                'approved_by',
                'approved_at',
                'vendor_assigned',
                'actual_cost',
                'resolution_notes',
            ]);
        });
    }
};
