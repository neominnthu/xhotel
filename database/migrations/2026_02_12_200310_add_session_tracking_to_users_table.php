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
        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('last_login_at')->nullable()->after('is_active');
            $table->string('last_login_ip', 45)->nullable()->after('last_login_at');
            $table->integer('login_count')->default(0)->after('last_login_ip');
            $table->timestamp('last_activity_at')->nullable()->after('login_count');
            $table->json('session_metadata')->nullable()->after('last_activity_at');
            $table->boolean('force_password_change')->default(false)->after('session_metadata');

            $table->index(['last_login_at', 'is_active']);
            $table->index(['last_activity_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'last_login_at',
                'last_login_ip',
                'login_count',
                'last_activity_at',
                'session_metadata',
                'force_password_change',
            ]);
        });
    }
};
