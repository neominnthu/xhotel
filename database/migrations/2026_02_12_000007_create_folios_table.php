<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('folios', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('reservation_id')->constrained()->cascadeOnUpdate();
            $table->char('currency', 3);
            $table->integer('total')->default(0);
            $table->integer('balance')->default(0);
            $table->enum('status', ['open', 'closed'])->default('open');
            $table->dateTime('closed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('reservation_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('folios');
    }
};
