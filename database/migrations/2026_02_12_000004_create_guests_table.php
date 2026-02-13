<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('guests', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->nullable()->unique();
            $table->string('name', 120);
            $table->text('phone')->nullable();
            $table->string('email', 120)->nullable();
            $table->string('id_type', 32)->nullable();
            $table->string('id_number', 64)->nullable();
            $table->string('nationality', 64)->nullable();
            $table->text('address')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('phone');
            $table->index('id_number');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guests');
    }
};
