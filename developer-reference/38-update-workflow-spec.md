# Update Workflow Spec (Draft)

Default language: Myanmar. English terms included where needed.

## Purpose

Production deployment မှာ App ကို GitHub release မှ update လုပ်နိုင်ရန်၊ backup/rollback ပါရှိတဲ့ safe workflow သတ်မှတ်ရန်။ Bug/Crash/Error report များကို GitHub Issues သို့ အလိုအလျောက် ပို့နိုင်ရန်။

## Scope (v1)

- Single-tenant update flow (one property per deployment)
- GitHub release based update (signed artifacts)
- Background database backup before update
- Automatic rollback on failure
- Error report integration to GitHub Issues

## Roles & Permissions

- Only `admin` (property admin / system admin) can trigger update/rollback/report.
- ABAC: property scope enforced.
- Update/backup/rollback must be audit logged.

## Update Lifecycle (State Machine)

States:
- `idle`
- `checking`
- `precheck_failed`
- `backup_running`
- `backup_failed`
- `downloading`
- `applying`
- `migrating`
- `health_check`
- `rollback_running`
- `rollback_failed`
- `completed`
- `failed`

Transitions (high-level):
1. idle -> checking
2. checking -> precheck_failed | backup_running
3. backup_running -> backup_failed | downloading
4. downloading -> applying
5. applying -> migrating
6. migrating -> health_check
7. health_check -> completed | rollback_running
8. rollback_running -> rollback_failed | failed

## Pre-Update Checks (Blocking)

- No active update running
- Database reachable, disk space >= threshold
- Queue workers healthy
- Optional: No open folio balance, no in-progress check-in/out
- Current version and target version compatibility verified
- Artifact signature and checksum verified

## Backup Requirements

- Database backup MUST run before applying update
- Backup metadata saved:
  - backup_id, timestamp, app_version, schema_version, checksum, size
- Backup stored in local storage or S3-compatible store
- Backup failure -> update stops

## Update Artifact (GitHub)

- GitHub Releases contain:
  - app package (zip/tar)
  - checksum (sha256)
  - release notes (markdown)
  - migration plan metadata (optional)
- Update service verifies checksum before apply
- Optional signature verification with public key

## Apply Steps (Background Job)

1. Prepare blue/green release directory
2. Run DB backup
3. Download release artifact
4. Verify checksum + signature
5. Extract to staging directory
6. Run `composer install --no-dev` if needed
7. Warm caches in staging
8. Run migrations (if required)
9. Swap symlink (atomic deploy)
10. Health check endpoint call
11. Enable maintenance gate only if health check fails

## Health Checks

- Required endpoints: `/health`, `/dashboard` (auth optional for health)
- DB read test
- Queue ping
- Fail => rollback

## Deployment Mode

- Default: blue/green (zero-downtime via atomic symlink swap)
- Maintenance gate is used only during rollback or when health check fails

## Rollback Plan

- Restore previous app artifact (last known good symlink)
- Restore DB from backup only if migrations/data transforms were applied
- If migration status is uncertain, require admin confirmation before DB restore
- Clear caches
- Health check
- If rollback fails: alert admin + block further updates

## Error Reporting to GitHub

- Errors captured from:
  - Backend exceptions
  - Frontend crash boundaries
  - Update failures
- Create GitHub Issue payload includes:
  - title, severity, environment, app_version
  - trace_id / request_id
  - user_id / role (no PII)
  - steps to reproduce (optional)
  - stack trace (trimmed / redacted)

## Audit & Metrics

Audit events:
- `system.update.started`, `system.update.completed`, `system.update.failed`
- `system.backup.started`, `system.backup.completed`, `system.backup.failed`
- `system.rollback.started`, `system.rollback.completed`, `system.rollback.failed`
- `system.error_report.created`

Metrics events (Log::info):
- `metrics.system.update.started`
- `metrics.system.update.completed`
- `metrics.system.update.failed`
- `metrics.system.backup.completed`
- `metrics.system.rollback.completed`

## API (Planned)

- `POST /api/v1/system/updates/check`
- `POST /api/v1/system/updates/apply`
- `POST /api/v1/system/updates/rollback`
- `POST /api/v1/system/backups`
- `POST /api/v1/system/reports/errors`

## UI Requirements

- Update button visible to admin only
- Progress panel with current state + logs
- Precheck report with block reasons
- Backup status and last backup info
- Confirm modal for update/rollback
- Error report form with optional steps

## Data Privacy & Security

- Do not send guest PII to GitHub
- Redact phone, email, passport/id numbers
- Only allow GitHub token stored in server config

## Reliability Rules

- Update must not break working system
- If any step fails, rollback to last known good state
- Keep last 3 backups minimum

## Testing Plan

- Feature test for update state transitions
- Backup/rollback mock tests
- GitHub issue creation stub tests
- Health check failure -> rollback test
