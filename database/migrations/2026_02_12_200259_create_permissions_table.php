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
        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name', 128)->unique();
            $table->string('display_name', 128);
            $table->string('group', 64)->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_system_permission')->default(false);
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['name', 'group', 'is_system_permission']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permissions');
    }
};
