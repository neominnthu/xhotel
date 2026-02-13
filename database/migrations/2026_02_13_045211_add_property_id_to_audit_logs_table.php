<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        if (! Schema::hasColumn('audit_logs', 'property_id')) {
            Schema::table('audit_logs', function (Blueprint $table) {
                $table->unsignedBigInteger('property_id')->nullable()->after('user_id');
            });
        }

        Schema::table('audit_logs', function (Blueprint $table) use ($driver) {
            if ($driver !== 'sqlite') {
                $table->foreign('property_id')
                    ->references('id')
                    ->on('properties')
                    ->nullOnDelete()
                    ->cascadeOnUpdate();
            }

            if (! $this->indexExists('audit_logs', 'audit_logs_property_id_created_at_index')) {
                $table->index(['property_id', 'created_at']);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        Schema::table('audit_logs', function (Blueprint $table) {
            if ($this->indexExists('audit_logs', 'audit_logs_property_id_created_at_index')) {
                $table->dropIndex(['audit_logs_property_id_created_at_index']);
            }
        });

        if ($driver !== 'sqlite') {
            Schema::table('audit_logs', function (Blueprint $table) {
                $table->dropForeign(['property_id']);
            });
        }

        Schema::table('audit_logs', function (Blueprint $table) {
            $table->dropColumn('property_id');
        });
    }

    private function indexExists(string $table, string $index): bool
    {
        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'sqlite') {
            $indexes = DB::select("PRAGMA index_list('$table')");
            $names = array_map(static fn ($row) => $row->name ?? null, $indexes);

            return in_array($index, $names, true);
        }

        $result = DB::select(
            'SELECT 1 FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = ? AND index_name = ? LIMIT 1',
            [$table, $index],
        );

        return ! empty($result);
    }
};
