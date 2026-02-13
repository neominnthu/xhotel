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
        Schema::create('report_daily_kpis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->cascadeOnUpdate();
            $table->date('report_date');
            $table->unsignedInteger('total_rooms')->default(0);
            $table->unsignedInteger('occupied_rooms')->default(0);
            $table->unsignedInteger('room_nights')->default(0);
            $table->unsignedInteger('total_revenue')->default(0);
            $table->unsignedInteger('adr')->default(0);
            $table->unsignedInteger('revpar')->default(0);
            $table->char('currency', 3)->default('MMK');
            $table->timestamps();

            $table->unique(['property_id', 'report_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_daily_kpis');
    }
};
