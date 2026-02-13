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
            $table->timestamp('started_at')->nullable()->after('assigned_to');
            $table->integer('estimated_duration_minutes')->nullable()->after('started_at');
            $table->integer('actual_duration_minutes')->nullable()->after('estimated_duration_minutes');
            $table->decimal('quality_score', 3, 2)->nullable()->after('actual_duration_minutes'); // 0.00 to 5.00
            $table->text('completion_notes')->nullable()->after('quality_score');
            $table->foreignId('completed_by')->nullable()->constrained('users')->onDelete('set null')->after('completion_notes');
            $table->timestamp('quality_reviewed_at')->nullable()->after('completed_by');
            $table->foreignId('quality_reviewed_by')->nullable()->constrained('users')->onDelete('set null')->after('quality_reviewed_at');

            $table->index(['assigned_to', 'status', 'completed_at']);
            $table->index(['started_at', 'completed_at']);
            $table->index(['quality_score', 'quality_reviewed_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('housekeeping_tasks', function (Blueprint $table) {
            $table->dropForeign(['completed_by']);
            $table->dropForeign(['quality_reviewed_by']);
            $table->dropColumn([
                'started_at',
                'estimated_duration_minutes',
                'actual_duration_minutes',
                'quality_score',
                'completion_notes',
                'completed_by',
                'quality_reviewed_at',
                'quality_reviewed_by',
            ]);
        });
    }
};
