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
        Schema::table('rates', function (Blueprint $table) {
            $table->json('days_of_week')->nullable()->after('min_stay');
            $table->unsignedSmallInteger('length_of_stay_min')->nullable()->after('days_of_week');
            $table->unsignedSmallInteger('length_of_stay_max')->nullable()->after('length_of_stay_min');
            $table->enum('adjustment_type', ['override', 'percent', 'amount'])->nullable()->after('length_of_stay_max');
            $table->integer('adjustment_value')->nullable()->after('adjustment_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rates', function (Blueprint $table) {
            $table->dropColumn([
                'days_of_week',
                'length_of_stay_min',
                'length_of_stay_max',
                'adjustment_type',
                'adjustment_value',
            ]);
        });
    }
};
