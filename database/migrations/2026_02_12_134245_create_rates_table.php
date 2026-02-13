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
        Schema::create('rates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_type_id')->constrained()->cascadeOnUpdate();
            $table->string('name');
            $table->enum('type', ['base', 'seasonal', 'special']);
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('rate')->unsigned(); // MMK in smallest unit
            $table->integer('min_stay')->unsigned()->default(1);
            $table->boolean('is_active')->default(true);
            $table->json('conditions')->nullable(); // Additional rules
            $table->timestamps();

            $table->index(['room_type_id', 'start_date', 'end_date']);
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rates');
    }
};
