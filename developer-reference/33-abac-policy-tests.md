# ABAC Policy Tests (Aligned to Edge Cases)

Each test maps to role, endpoint, and expected outcome.

## Front Desk

- POST /reservations: allowed for walk_in -> 200
- PATCH /reservations/{id}: allowed when status != checked_out -> 200
- PATCH /reservations/{id}: deny if has payment -> 403 AUTHZ_DENIED
- POST /stays/{id}/check-in: allowed if room available -> 200
- POST /stays/{id}/check-out: deny if folio balance > 0 -> 403 AUTHZ_DENIED

## Reservation Manager

- PATCH /reservations/{id}: allowed for any status except checked_out -> 200
- POST /reservations/{id}/cancel: allowed for confirmed -> 200
- POST /stays/{id}/check-out: allowed with override -> 200

## Housekeeping

- PATCH /housekeeping/tasks/{id}: allowed -> 200
- PATCH /rooms/{id}/assign: denied -> 403 AUTHZ_DENIED
- GET /reservations: allowed but limited fields -> 200

## Cashier

- POST /folios/{id}/payments: allowed -> 200
- POST /folios/{id}/charges: allowed only for fees -> 200
- PATCH /reservations/{id}: denied -> 403 AUTHZ_DENIED
- POST /stays/{id}/check-out: allowed -> 200

## Admin

- All endpoints allowed unless resource not found -> 404

## Edge-Case Alignment

- Any denied action returns 403 AUTHZ_DENIED
- Denied action must be logged in audit_logs
- Forbidden actions must not mutate data
