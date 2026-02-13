# Error Codes Matrix and Edge-Case Behaviors (v1)

This document standardizes error responses and edge-case handling.
All errors use JSON with a top-level message and optional errors map.

## Error Response Shape

{
  "code": "RESERVATION_NOT_FOUND",
  "message": "Reservation not found",
  "errors": {
    "reservation_id": ["Invalid reservation id"]
  }
}

## HTTP Status Mapping

- 400 Bad Request: malformed payload or invalid query
- 401 Unauthorized: missing or invalid token
- 403 Forbidden: ABAC or role denies action
- 404 Not Found: resource does not exist
- 409 Conflict: state conflict or concurrent change
- 422 Unprocessable Entity: validation errors
- 429 Too Many Requests: rate limit
- 500 Internal Server Error: unexpected

## Error Code Matrix

### Auth

- AUTH_INVALID_CREDENTIALS (401)
- AUTH_TOKEN_EXPIRED (401)
- AUTH_TOKEN_REVOKED (401)
- AUTH_RATE_LIMIT (429)

### Reservations

- RESERVATION_NOT_FOUND (404)
- RESERVATION_STATUS_INVALID (409)
- RESERVATION_DATE_CONFLICT (409)
- RESERVATION_ROOM_UNAVAILABLE (409)
- RESERVATION_OVERLAP (409)
- RESERVATION_VALIDATION_ERROR (422)

### Rooms

- ROOM_NOT_FOUND (404)
- ROOM_STATUS_INVALID (409)
- ROOM_ALREADY_ASSIGNED (409)

### Stays

- STAY_NOT_FOUND (404)
- STAY_STATUS_INVALID (409)
- STAY_ROOM_REQUIRED (422)
- STAY_CHECKIN_BLOCKED (409)

### Folios

- FOLIO_NOT_FOUND (404)
- FOLIO_CLOSED (409)
- FOLIO_BALANCE_MISMATCH (409)
- FOLIO_CURRENCY_MISMATCH (409)
- FOLIO_REFUND_EXCEEDS_PAID (409)
- FOLIO_REFUND_PAYMENT_MISMATCH (409)

### Payments

- PAYMENT_METHOD_INVALID (422)
- PAYMENT_GATEWAY_FAILED (502)
- PAYMENT_REFERENCE_DUPLICATE (409)

### Refunds

- REFUND_STATUS_INVALID (409)

### Housekeeping

- TASK_NOT_FOUND (404)
- TASK_STATUS_INVALID (409)

### Rates

- RATE_DATE_OVERLAP (422)

### Admin

- USER_EMAIL_TAKEN (409)
- POLICY_INVALID (422)

### Updates & Backups

- UPDATE_PACKAGE_NOT_FOUND (404)
- UPDATE_IN_PROGRESS (409)
- UPDATE_PRECHECK_FAILED (409)
- UPDATE_APPLY_FAILED (500)
- UPDATE_CHECKSUM_FAILED (500)
- UPDATE_SIGNATURE_FAILED (500)
- UPDATE_SMOKE_FAILED (500)
- UPDATE_ROLLBACK_FAILED (500)
- BACKUP_FAILED (500)

### Error Reporting

- REPORT_VALIDATION_ERROR (422)
- REPORT_GITHUB_UNAVAILABLE (502)

## Edge-Case Behaviors

### Reservation Creation

- If room type is sold out, return 409 RESERVATION_ROOM_UNAVAILABLE.
- If check_out <= check_in, return 422 RESERVATION_VALIDATION_ERROR.
- If reservation overlaps same room assignment, return 409 RESERVATION_OVERLAP.

### Reservation Update

- If status is checked_out, return 409 RESERVATION_STATUS_INVALID.
- If status is checked_in and date/room changes are attempted, return 409 RESERVATION_STATUS_INVALID.
- If moving room causes overlap, return 409 RESERVATION_ROOM_UNAVAILABLE.

### Check-in

- If stay status is not expected, return 409 STAY_STATUS_INVALID.
- If room is not available, return 409 ROOM_STATUS_INVALID.

### Check-out

- If folio balance is not zero and no payment provided, return 409 FOLIO_BALANCE_MISMATCH.
- If stay already checked out, return 409 STAY_STATUS_INVALID.

### Charges and Payments

- If folio is closed, return 409 FOLIO_CLOSED.
- If currency does not match folio currency and exchange rate missing, return 409 FOLIO_CURRENCY_MISMATCH.

### Refunds

- If folio balance is not zero, return 409 FOLIO_BALANCE_MISMATCH.
- If refund exceeds paid total, return 409 FOLIO_REFUND_EXCEEDS_PAID.
- If refund payment does not match folio, return 409 FOLIO_REFUND_PAYMENT_MISMATCH.
- If refund is not pending, return 409 REFUND_STATUS_INVALID.

### ABAC

- If policy denies action, return 403 with code AUTHZ_DENIED.
- Log denied action with user, resource, and policy.

## Error Code Conventions

- Uppercase with underscores.
- Prefix by domain (AUTH_, RESERVATION_, ROOM_, STAY_, FOLIO_, PAYMENT_, TASK_, POLICY_).
- Include a human-readable message in Myanmar and English in UI layer.
