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
        Schema::create('refunds', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('folio_id')->constrained()->cascadeOnUpdate();
            $table->foreignId('payment_id')->nullable()->constrained()->nullOnDelete()->cascadeOnUpdate();
            $table->string('method', 32);
            $table->integer('amount');
            $table->char('currency', 3);
            $table->decimal('exchange_rate', 12, 6)->default(1);
            $table->integer('folio_amount');
            $table->string('status', 16)->default('pending');
            $table->string('reference', 64)->nullable();
            $table->string('reason', 255)->nullable();
            $table->dateTime('approved_at')->nullable();
            $table->foreignId('requested_by')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();
            $table->dateTime('refunded_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['folio_id', 'status']);
            $table->index('approved_at');
            $table->index('requested_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('refunds');
    }
};
