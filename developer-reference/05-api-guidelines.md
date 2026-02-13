# API Guidelines

## General

- REST JSON API
- Use standard HTTP status codes
- Validation errors return 422 with field-level messages
- All timestamps are UTC

## Conventions

- Base path: /api/v1
- Versioning via URL prefix when needed (e.g., /api/v1)
- Use JSON request/response bodies
- Use Authorization: Bearer <token>
- Idempotency key for payment/refund endpoints

## Pagination

- Query: page, per_page
- Response includes: data, meta.total, meta.page, meta.per_page

## Filtering and Sorting

- Filter format: ?filter[status]=confirmed
- Sort format: ?sort=-check_in (prefix '-' for desc)

## Error Shape

{
	"message": "Validation error",
	"errors": {
		"check_in": ["Check-in date is required"]
	}
}

## Auth

- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me

## Reservations

- GET /api/reservations
- POST /api/reservations
- PATCH /api/reservations/{id}
- POST /api/reservations/{id}/cancel

### Example Create Reservation (Request)

{
	"guest": {
		"name": "Aye Aye",
		"phone": "+959123456"
	},
	"check_in": "2026-02-14",
	"check_out": "2026-02-16",
	"room_type_id": 3,
	"adults": 2,
	"children": 0,
	"source": "walk_in"
}

### Example Create Reservation (Response)

{
	"id": 1201,
	"code": "RSV-20260214-001",
	"status": "confirmed",
	"check_in": "2026-02-14",
	"check_out": "2026-02-16"
}

## Front Desk

- POST /api/stays/{id}/check-in
- POST /api/stays/{id}/check-out
- PATCH /api/rooms/{id}/assign

## Billing

- POST /api/folios/{id}/charges
- POST /api/folios/{id}/payments
- GET /api/folios/{id}/statement

## Webhooks (Optional)

- payment.succeeded
- payment.failed
- reservation.canceled

## Housekeeping

- GET /api/housekeeping/tasks
- PATCH /api/housekeeping/tasks/{id}

## Admin

- GET /api/users
- POST /api/abac/policies

## Release & Diagnostics (Planned)

- POST /api/v1/system/updates/check
	- Checks GitHub release metadata and returns available version info.
- POST /api/v1/system/updates/apply
	- Starts background update with maintenance mode + health checks.
	- Must trigger database backup before applying the update.
- POST /api/v1/system/updates/rollback
	- Restores last successful backup + previous release artifacts.
- POST /api/v1/system/backups
	- Creates a database backup and returns backup identifier.
- POST /api/v1/system/reports/errors
	- Sends structured error report to GitHub Issues.
	- Payload should include title, severity, steps, trace_id, user_id, app_version.

