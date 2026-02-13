<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('charges', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('folio_id')->constrained()->cascadeOnUpdate();
            $table->string('type', 32);
            $table->integer('amount');
            $table->char('currency', 3);
            $table->integer('tax_amount')->default(0);
            $table->string('description', 255)->nullable();
            $table->dateTime('posted_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();
            $table->timestamps();
            $table->softDeletes();

            $table->index('folio_id');
            $table->index('posted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('charges');
    }
};
