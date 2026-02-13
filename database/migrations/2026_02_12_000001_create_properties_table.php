<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('name', 150);
            $table->text('address')->nullable();
            $table->string('timezone', 64)->default('Asia/Yangon');
            $table->char('default_currency', 3)->default('MMK');
            $table->char('default_language', 2)->default('my');
            $table->text('receipt_header')->nullable();
            $table->string('tax_id', 64)->nullable();
            $table->string('phone', 32)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
