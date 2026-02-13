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
        Schema::create('cashier_shifts', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('property_id')->constrained()->cascadeOnUpdate();
            $table->foreignId('cashier_id')->constrained('users')->cascadeOnUpdate();
            $table->dateTime('opened_at');
            $table->dateTime('closed_at')->nullable();
            $table->char('currency', 3)->default('MMK');
            $table->integer('opening_cash')->default(0);
            $table->integer('closing_cash')->nullable();
            $table->integer('expected_cash')->nullable();
            $table->integer('variance')->nullable();
            $table->integer('total_cash')->default(0);
            $table->integer('total_card')->default(0);
            $table->string('status', 16)->default('open');
            $table->string('notes', 255)->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();
            $table->dateTime('approved_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['property_id', 'cashier_id', 'status']);
            $table->index(['cashier_id', 'opened_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cashier_shifts');
    }
};
