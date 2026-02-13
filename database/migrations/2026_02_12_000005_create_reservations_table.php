<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('property_id')->constrained()->cascadeOnUpdate();
            $table->foreignId('guest_id')->constrained()->cascadeOnUpdate();
            $table->string('code', 32)->unique();
            $table->enum('status', ['pending', 'confirmed', 'checked_in', 'checked_out', 'canceled', 'no_show']);
            $table->enum('source', ['walk_in', 'phone', 'ota', 'corporate']);
            $table->date('check_in');
            $table->date('check_out');
            $table->foreignId('room_type_id')->constrained()->cascadeOnUpdate();
            $table->foreignId('room_id')->nullable()->constrained()->nullOnDelete()->cascadeOnUpdate();
            $table->unsignedTinyInteger('adults');
            $table->unsignedTinyInteger('children')->default(0);
            $table->text('special_requests')->nullable();
            $table->text('canceled_reason')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['property_id', 'status']);
            $table->index('check_in');
            $table->index('check_out');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
