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
        Schema::create('system_update_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('system_update_id')->constrained('system_updates')->cascadeOnUpdate()->cascadeOnDelete();
            $table->string('level', 16)->default('info');
            $table->string('message', 255);
            $table->json('context')->nullable();
            $table->timestamps();

            $table->index(['system_update_id', 'level']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('system_update_logs');
    }
};
