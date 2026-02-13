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
        Schema::create('housekeeping_performances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('performance_date');
            $table->integer('tasks_assigned')->default(0);
            $table->integer('tasks_completed')->default(0);
            $table->integer('tasks_completed_on_time')->default(0);
            $table->integer('tasks_overdue')->default(0);
            $table->decimal('average_quality_score', 3, 2)->nullable();
            $table->integer('total_minutes_worked')->default(0);
            $table->integer('rooms_cleaned')->default(0);
            $table->integer('inspections_completed')->default(0);
            $table->integer('maintenance_tasks_completed')->default(0);
            $table->decimal('efficiency_rating', 5, 2)->nullable(); // Calculated metric
            $table->json('performance_metadata')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'performance_date']);
            $table->index(['performance_date', 'efficiency_rating']);
            $table->index(['user_id', 'performance_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('housekeeping_performances');
    }
};
