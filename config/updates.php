<?php

return [
    'enabled' => env('UPDATES_ENABLED', false),
    'current_version' => env('APP_VERSION', '0.0.0'),
    'deploy_mode' => env('UPDATES_DEPLOY_MODE', 'prepare'), // prepare|swap
    'release_path' => env('UPDATES_RELEASE_PATH', base_path('releases')),
    'current_path' => env('UPDATES_CURRENT_PATH', base_path()),
    'previous_path' => env('UPDATES_PREVIOUS_PATH'),
    'health_check_url' => env('UPDATES_HEALTH_CHECK_URL'),
    'php_binary' => env('UPDATES_PHP_BINARY', 'php'),
    'composer_binary' => env('UPDATES_COMPOSER_BINARY', 'composer'),
    'backup_disk' => env('UPDATES_BACKUP_DISK', 'local'),
    'backup_path' => env('UPDATES_BACKUP_PATH', 'system/backups'),
    'backup_retention_days' => env('UPDATES_BACKUP_RETENTION_DAYS', 30),
    'backup_retention_count' => env('UPDATES_BACKUP_RETENTION_COUNT', 10),
    'mysql_dump_path' => env('UPDATES_MYSQL_DUMP_PATH', 'mysqldump'),
    'mysql_restore_path' => env('UPDATES_MYSQL_RESTORE_PATH', 'mysql'),
    'scheduled_backups' => [
        'enabled' => env('UPDATES_SCHEDULED_BACKUPS_ENABLED', false),
        'time' => env('UPDATES_SCHEDULED_BACKUPS_TIME', '02:00'),
    ],
    'github' => [
        'owner' => env('UPDATES_GITHUB_OWNER'),
        'repo' => env('UPDATES_GITHUB_REPO'),
        'token' => env('UPDATES_GITHUB_TOKEN'),
        'token_disk' => env('UPDATES_GITHUB_TOKEN_DISK', 'local'),
        'token_path' => env('UPDATES_GITHUB_TOKEN_PATH', 'system/secrets/github-token'),
        'release_asset' => env('UPDATES_GITHUB_ASSET', 'xhotel-release.zip'),
        'checksum_asset' => env('UPDATES_GITHUB_CHECKSUM_ASSET', 'xhotel-release.sha256'),
        'signature_asset' => env('UPDATES_GITHUB_SIGNATURE_ASSET', 'xhotel-release.sig'),
        'signature_public_key_path' => env('UPDATES_SIGNATURE_PUBLIC_KEY_PATH'),
        'issue_label' => env('UPDATES_GITHUB_ISSUE_LABEL', 'xhotel-pms'),
    ],
    'smoke_tests' => [
        'enabled' => env('UPDATES_SMOKE_TESTS_ENABLED', true),
    ],
    'error_reports' => [
        'enabled' => env('ERROR_REPORTS_ENABLED', true),
    ],
];
