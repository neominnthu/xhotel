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
        Schema::table('guests', function (Blueprint $table) {
            $table->string('first_name', 120)->nullable();
            $table->string('last_name', 120)->nullable();
            $table->string('phone_country_code', 8)->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('gender', 16)->nullable();
            $table->string('passport_number', 64)->nullable();
            $table->string('id_card_number', 64)->nullable();
            $table->string('city', 64)->nullable();
            $table->string('country', 64)->nullable();
            $table->string('postal_code', 20)->nullable();
            $table->string('company', 120)->nullable();
            $table->json('preferences')->nullable();
            $table->text('special_requests')->nullable();
            $table->boolean('is_blacklisted')->default(false);
            $table->text('blacklist_reason')->nullable();
            $table->dateTime('last_visit_at')->nullable();
            $table->unsignedInteger('total_stays')->default(0);
            $table->unsignedInteger('total_spent')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('guests', function (Blueprint $table) {
            $table->dropColumn([
                'first_name',
                'last_name',
                'phone_country_code',
                'date_of_birth',
                'gender',
                'passport_number',
                'id_card_number',
                'city',
                'country',
                'postal_code',
                'company',
                'preferences',
                'special_requests',
                'is_blacklisted',
                'blacklist_reason',
                'last_visit_at',
                'total_stays',
                'total_spent',
            ]);
        });
    }
};
