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
        Schema::table('payments', function (Blueprint $table) {
            $table->string('card_last_four', 4)->nullable()->after('reference');
            $table->enum('card_type', ['visa', 'mastercard', 'amex', 'discover', 'other'])->nullable()->after('card_last_four');
            $table->string('bank_details', 255)->nullable()->after('card_type');
            $table->enum('wallet_type', ['paypal', 'apple_pay', 'google_pay', 'venmo', 'zelle', 'other'])->nullable()->after('bank_details');
            $table->string('check_number', 64)->nullable()->after('wallet_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn(['card_last_four', 'card_type', 'bank_details', 'wallet_type', 'check_number']);
        });
    }
};
