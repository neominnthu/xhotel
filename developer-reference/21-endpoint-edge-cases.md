# Endpoint Edge-Case Test Matrix (v1)

Each entry specifies endpoint, edge case, and expected outcome.

## Auth

- POST /auth/login: wrong password -> 401 AUTH_INVALID_CREDENTIALS
- POST /auth/login: too many attempts -> 429 AUTH_RATE_LIMIT
- POST /auth/logout: revoked token -> 401 AUTH_TOKEN_REVOKED

## Reservations

- POST /reservations: check_out <= check_in -> 422 RESERVATION_VALIDATION_ERROR
- POST /reservations: room type sold out -> 409 RESERVATION_ROOM_UNAVAILABLE
- POST /reservations: missing guest name -> 422 RESERVATION_VALIDATION_ERROR
- PATCH /reservations/{id}: checked_out -> 409 RESERVATION_STATUS_INVALID
- PATCH /reservations/{id}: assign occupied room -> 409 ROOM_STATUS_INVALID
- POST /reservations/{id}/cancel: already canceled -> 409 RESERVATION_STATUS_INVALID

## Rooms

- PATCH /rooms/{id}/assign: room not available -> 409 ROOM_STATUS_INVALID
- PATCH /rooms/{id}/assign: reservation canceled -> 409 RESERVATION_STATUS_INVALID

## Stays

- POST /stays/{id}/check-in: stay not expected -> 409 STAY_STATUS_INVALID
- POST /stays/{id}/check-in: room out_of_order -> 409 ROOM_STATUS_INVALID
- POST /stays/{id}/check-out: balance not zero -> 409 FOLIO_BALANCE_MISMATCH
- POST /stays/{id}/check-out: already checked_out -> 409 STAY_STATUS_INVALID

## Folios and Charges

- POST /folios/{id}/charges: folio closed -> 409 FOLIO_CLOSED
- POST /folios/{id}/charges: negative amount -> 422 RESERVATION_VALIDATION_ERROR
- POST /folios/{id}/payments: currency mismatch w/o exchange rate -> 409 FOLIO_CURRENCY_MISMATCH
- POST /folios/{id}/payments: duplicate reference -> 409 PAYMENT_REFERENCE_DUPLICATE

## Housekeeping

- PATCH /housekeeping/tasks/{id}: invalid status -> 422 TASK_STATUS_INVALID
- PATCH /housekeeping/tasks/{id}: task not found -> 404 TASK_NOT_FOUND

## Reports

- GET /reports/occupancy: to < from -> 422 RESERVATION_VALIDATION_ERROR
- GET /reports/cashier-shift: cashier_id invalid -> 404 USER_NOT_FOUND

## Cashier Shifts

- POST /cashier-shifts/open: existing open shift -> 409 CASHIER_SHIFT_ALREADY_OPEN
- POST /cashier-shifts/{id}/close: shift not open -> 409 CASHIER_SHIFT_NOT_OPEN

## Admin

- POST /users: email already taken -> 409 USER_EMAIL_TAKEN
- POST /abac/policies: invalid JSON rules -> 422 POLICY_INVALID

## System Updates & Diagnostics

- POST /system/updates/apply: update already running -> 409 UPDATE_IN_PROGRESS
- POST /system/updates/apply: updates disabled -> 409 UPDATE_PRECHECK_FAILED
- POST /system/updates/apply: update package missing -> 404 UPDATE_PACKAGE_NOT_FOUND
- POST /system/updates/rollback: update not found -> 404 UPDATE_PACKAGE_NOT_FOUND
- POST /system/backups: backup failure -> 500 BACKUP_FAILED
- POST /system/reports/errors: GitHub API unavailable -> 502 REPORT_GITHUB_UNAVAILABLE

## ABAC

- Any mutating endpoint with denied policy -> 403 AUTHZ_DENIED
- Any endpoint without token -> 401 AUTH_TOKEN_REQUIRED
