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
        Schema::create('availability_holds', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('property_id')->constrained()->cascadeOnUpdate();
            $table->foreignId('room_type_id')->constrained()->cascadeOnUpdate();
            $table->foreignId('room_id')->nullable()->constrained()->nullOnDelete()->cascadeOnUpdate();
            $table->date('check_in');
            $table->date('check_out');
            $table->unsignedInteger('quantity')->default(1);
            $table->string('token', 64)->unique();
            $table->dateTime('expires_at');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['property_id', 'room_type_id']);
            $table->index(['check_in', 'check_out']);
            $table->index('expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('availability_holds');
    }
};
