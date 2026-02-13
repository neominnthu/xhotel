<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('property_id')->constrained()->cascadeOnUpdate();
            $table->foreignId('room_type_id')->constrained()->cascadeOnUpdate();
            $table->string('number', 16);
            $table->string('floor', 16)->nullable();
            $table->enum('status', ['available', 'occupied', 'out_of_order'])->default('available');
            $table->enum('housekeeping_status', ['clean', 'dirty', 'inspected'])->default('clean');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['property_id', 'number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
