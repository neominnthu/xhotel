# Audit & Metrics Events

This document lists the audit log events and short-lived metrics messages emitted by settings controllers.

## Cancellation Policy
- audit: `cancellation_policy.created`, `cancellation_policy.updated`, `cancellation_policy.deleted`
- metrics (Log::info): `metrics.cancellation_policy.created`, `metrics.cancellation_policy.updated`, `metrics.cancellation_policy.deleted`
  - payload fields: `policy_id`, `property_id`, `user_id`

## Room Type
- audit: `room_type.created`, `room_type.updated`, `room_type.deleted`
- metrics: `metrics.room_type.created`, `metrics.room_type.updated`, `metrics.room_type.deleted`
  - payload fields: `room_type_id`, `property_id`, `user_id`

## Rate
- audit: `rate.created`, `rate.updated`, `rate.deleted`
- metrics: `metrics.rate.created`, `metrics.rate.updated`, `metrics.rate.deleted`
  - payload fields: `rate_id`, `property_id`, `user_id`

## Notes
- Audit logs are persisted in `audit_logs` table and should be asserted in feature tests.
- Metrics are emitted via `Log::info(...)` and are intended for downstream scraping; tests may use `Log::shouldReceive()` to assert emissions.

## Updates & Diagnostics (Planned)
- audit: `system.update.started`, `system.update.completed`, `system.update.failed`
- audit: `system.backup.started`, `system.backup.completed`, `system.backup.failed`
- audit: `system.rollback.started`, `system.rollback.completed`, `system.rollback.failed`
- audit: `system.error_report.created`
- metrics: `metrics.system.update.started`, `metrics.system.update.completed`, `metrics.system.update.failed`
- metrics: `metrics.system.backup.completed`, `metrics.system.rollback.completed`
  - payload fields: `update_id`, `backup_id`, `version_from`, `version_to`, `user_id`, `property_id`

## Migration note
- A migration (`2026_02_13_000001_add_indexes_to_audit_logs.php`) was added to index `audit_logs` on `action,resource` and `property_id` to improve query performance.
- Run `php artisan migrate` on dev/staging/production during the next deploy; add an alert to monitor `audit_logs` query latency after deployment.
