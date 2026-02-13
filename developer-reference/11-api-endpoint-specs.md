# API Endpoint Specs (v1)

Base URL: /api/v1
Auth: Bearer token (Laravel Sanctum)
Response format: JSON
Time format: ISO 8601 (UTC)

## Common Schemas

### ErrorResponse

{
  "message": "Validation error",
  "errors": {
    "field": ["Reason"]
  }
}

### Pagination

{
  "data": [],
  "meta": {
    "total": 120,
    "page": 1,
    "per_page": 20
  }
}

### Money

{
  "amount": 120000,
  "currency": "MMK"
}

## Auth

### POST /auth/login

Request
{
  "email": "agent@hotel.com",
  "password": "secret"
}

Response
{
  "token": "<jwt_or_token>",
  "user": {
    "id": 12,
    "name": "Front Desk",
    "role": "front_desk"
  }
}

### POST /auth/logout

Response
{
  "ok": true
}

### GET /auth/me

Response
{
  "id": 12,
  "name": "Front Desk",
  "email": "agent@hotel.com",
  "role": "front_desk",
  "department": "front_desk"
}

## Properties

### GET /properties/current

Response
{
  "id": 1,
  "name": "XHotel Yangon",
  "timezone": "Asia/Yangon",
  "default_currency": "MMK",
  "default_language": "my"
}

## Rooms and Room Types

### GET /room-types

Response
{
  "data": [
    {
      "id": 3,
      "name": {"my": "Deluxe", "en": "Deluxe"},
      "capacity": 2,
      "base_rate": {"amount": 80000, "currency": "MMK"}
    }
  ]
}

### GET /rooms

Query
- filter[status]=clean
- filter[room_type_id]=3

Response
{
  "data": [
    {
      "id": 101,
      "number": "301",
      "room_type_id": 3,
      "status": "clean",
      "housekeeping_status": "clean"
    }
  ]
}

### PATCH /rooms/{id}/assign

Request
{
  "reservation_id": 1201
}

Response
{
  "id": 101,
  "number": "301",
  "status": "occupied"
}

## Availability

### GET /availability

Query
- room_type_id: required, integer
- check_in: required, date
- check_out: required, date
- quantity: optional, integer

Response
{
  "available": true,
  "available_count": 3
}

### GET /availability/holds

Response
{
  "data": [
    {
      "id": 91,
      "room_type_id": 3,
      "room_id": null,
      "check_in": "2026-02-14",
      "check_out": "2026-02-16",
      "quantity": 1,
      "expires_at": "2026-02-14T05:30:00Z",
      "token": "<token>"
    }
  ]
}

### POST /availability/holds

Request
{
  "room_type_id": 3,
  "room_id": null,
  "check_in": "2026-02-14",
  "check_out": "2026-02-16",
  "quantity": 1,
  "expires_in_minutes": 15
}

Response
{
  "id": 91,
  "room_type_id": 3,
  "room_id": null,
  "check_in": "2026-02-14",
  "check_out": "2026-02-16",
  "quantity": 1,
  "expires_at": "2026-02-14T05:30:00Z",
  "token": "<token>"
}

### DELETE /availability/holds/{id}

Response
{
  "status": "ok"
}

## Settings (Web)

### GET /settings/room-types

Response
Inertia page with room type list and form state.

### POST /settings/room-types

Request
{
  "name_en": "Deluxe",
  "name_my": "ဒီလက်စ်",
  "capacity": 2,
  "overbooking_limit": 3,
  "base_rate": 150000,
  "sort_order": 1,
  "is_active": true
}

Response
302 redirect with flash success or validation errors.

### PATCH /settings/room-types/{roomType}

Request
{
  "name_en": "Suite",
  "name_my": "စွစ်",
  "capacity": 3,
  "overbooking_limit": 1,
  "base_rate": 200000,
  "sort_order": 2,
  "is_active": false
}

Response
302 redirect with flash success or validation errors.

### DELETE /settings/room-types/{roomType}

Response
302 redirect with flash success.

### GET /settings/rates

Response
Inertia page with rate list and form state.

### POST /settings/rates

Request
{
  "room_type_id": 3,
  "name": "Base Rate",
  "type": "base",
  "start_date": "2026-02-10",
  "end_date": "2026-02-12",
  "rate": 150000,
  "min_stay": 1,
  "days_of_week": [1, 2, 3],
  "length_of_stay_min": 1,
  "length_of_stay_max": 5,
  "adjustment_type": "override",
  "adjustment_value": 140000,
  "is_active": true
}

Response
302 redirect with flash success or validation errors.

### PATCH /settings/rates/{rate}

Request
{
  "room_type_id": 3,
  "name": "Seasonal",
  "type": "seasonal",
  "start_date": "2026-02-11",
  "end_date": "2026-02-15",
  "rate": 170000,
  "min_stay": 2,
  "days_of_week": [4, 5],
  "length_of_stay_min": 2,
  "length_of_stay_max": 7,
  "adjustment_type": "percent",
  "adjustment_value": 10,
  "is_active": false
}

Response
302 redirect with flash success or validation errors.

### DELETE /settings/rates/{rate}

Response
302 redirect with flash success.

### GET /settings/exchange-rates

Response
Inertia page with exchange rate list and form state.

### POST /settings/exchange-rates

Request
{
  "base_currency": "MMK",
  "quote_currency": "USD",
  "rate": 3500,
  "effective_date": "2026-02-13",
  "source": "manual",
  "is_active": true
}

Response
302 redirect with flash success or validation errors.

### PATCH /settings/exchange-rates/{exchangeRate}

Request
{
  "base_currency": "MMK",
  "quote_currency": "USD",
  "rate": 3600,
  "effective_date": "2026-02-14",
  "source": "manual",
  "is_active": false
}

Response
302 redirect with flash success or validation errors.

### DELETE /settings/exchange-rates/{exchangeRate}

Response
302 redirect with flash success.

## Reservations

### GET /reservations

Query
- filter[status]=confirmed
- filter[check_in]=2026-02-14
- sort=-check_in

Response
{
  "data": [
    {
      "id": 1201,
      "code": "RSV-20260214-001",
      "status": "confirmed",
      "check_in": "2026-02-14",
      "check_out": "2026-02-16",
      "guest": {"id": 501, "name": "Aye Aye"},
      "room_type_id": 3,
      "room_id": null
    }
  ]
}

### POST /reservations

Request
{
  "guest": {
    "name": "Aye Aye",
    "phone": "+959123456",
    "id_type": "nrc",
    "id_number": "12/YGN(N)123456"
  },
  "check_in": "2026-02-14",
  "check_out": "2026-02-16",
  "room_type_id": 3,
  "adults": 2,
  "children": 0,
  "source": "walk_in",
  "special_requests": "Late check-in"
}

Response
{
  "id": 1201,
  "code": "RSV-20260214-001",
  "status": "confirmed",
  "check_in": "2026-02-14",
  "check_out": "2026-02-16"
}

### PATCH /reservations/{id}

Request
{
  "check_out": "2026-02-17",
  "adults": 3,
  "room_id": 210,
  "special_requests": "Late check-in"
}

Response
{
  "id": 1201,
  "status": "confirmed",
  "check_in": "2026-02-14",
  "check_out": "2026-02-17"
}

### POST /reservations/{id}/cancel

Request
{
  "reason": "Guest no show"
}

Response
{
  "id": 1201,
  "status": "canceled"
}

## Stays (Front Desk)

### POST /stays/{id}/check-in

Request
{
  "room_id": 101,
  "deposit": {"amount": 50000, "currency": "MMK"}
}

Response
{
  "id": 9001,
  "status": "checked_in",
  "actual_check_in": "2026-02-14T06:20:00Z"
}

### POST /stays/{id}/check-out

Request
{
  "payment": {
    "method": "cash",
    "amount": 150000,
    "currency": "MMK"
  }
}

Response
{
  "id": 9001,
  "status": "checked_out",
  "actual_check_out": "2026-02-16T04:00:00Z"
}

### POST /front-desk/stays/{id}/extend

Request
{
  "check_out": "2026-02-18"
}

Response
{
  "message": "Stay extended successfully",
  "reservation": {
    "id": 1201,
    "check_out": "2026-02-18"
  }
}

## Folios, Charges, Payments

### GET /folios/{id}

Response
{
  "id": 7001,
  "reservation_id": 1201,
  "currency": "MMK",
  "total": 200000,
  "balance": 50000,
  "charges": [
    {"id": 1, "type": "room", "amount": 100000, "tax_amount": 5000}
  ],
  "payments": [
    {"id": 1, "method": "cash", "amount": 50000, "currency": "MMK"}
  ],
  "refunds": [
    {"id": 1, "method": "cash", "amount": 5000, "currency": "MMK", "status": "approved"}
  ]
}

### POST /folios/{id}/charges

Request
{
  "type": "minibar",
  "description": "Snacks",
  "amount": 8000,
  "currency": "MMK",
  "tax_amount": 400
}

Response
{
  "id": 12,
  "type": "minibar",
  "amount": 8000,
  "currency": "MMK"
}

### POST /folios/{id}/payments

Request
{
  "method": "card",
  "amount": 100000,
  "currency": "MMK",
  "exchange_rate": 1,
  "reference": "KBZ-123456"
}

Response
{
  "id": 44,
  "method": "card",
  "amount": 100000,
  "currency": "MMK"
}

### POST /folios/{id}/refunds

Request
{
  "method": "cash",
  "amount": 5000,
  "currency": "MMK",
  "reference": "RF-10001",
  "reason": "Deposit return"
}

Response
{
  "id": 55,
  "method": "cash",
  "amount": 5000,
  "currency": "MMK",
  "status": "pending"
}

### POST /refunds/{id}/approve

Request
{
  "reference": "RF-10001"
}

Response
{
  "id": 55,
  "status": "approved",
  "approved_at": "2026-02-14T03:15:00Z",
  "refunded_at": "2026-02-14T03:15:00Z"
}

### GET /folios/{id}/statement

Response
{
  "folio_id": 7001,
  "currency": "MMK",
  "lines": [
    {"date": "2026-02-14", "type": "room", "amount": 100000}
  ],
  "total": 200000,
  "balance": 50000
}

## Housekeeping

### GET /housekeeping/tasks
Query
- filter[status]=open
- filter[priority]=high
- filter[room_id]=101
- filter[assigned_to]=12 | unassigned
- filter[room_status]=dirty
- filter[type]=clean
- filter[due_from]=2026-02-14
- filter[due_to]=2026-02-20
- filter[completed_from]=2026-02-01
- filter[completed_to]=2026-02-07
- filter[overdue]=1
- filter[sort]=due_at|priority|room_number
- filter[sort_dir]=asc|desc
- page=1
- per_page=15

Response
{
  "data": [
    {
      "id": 5001,
      "type": "clean",
      "status": "open",
      "priority": "high",
      "assigned_to": 12,
      "due_at": "2026-02-14 09:00:00",
      "completed_at": "2026-02-06 12:00:00",
      "room": {
        "id": 101,
        "number": "301",
        "room_status": "clean"
      },
      "assignee": {
        "id": 12,
        "name": "Aye Aye"
      }
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 15,
    "total": 72
  }
}

### POST /housekeeping/tasks

Request
{
  "room_id": 101,
  "type": "clean",
  "priority": "high",
  "assigned_to": 12,
  "due_at": "2026-02-14T09:00:00Z"
}

Response
{
  "id": 5001,
  "status": "open"
}

### PATCH /housekeeping/tasks/bulk

Request
{
  "task_ids": [5001, 5002],
  "status": "completed",
  "assigned_to": 12
}

Response
{
  "updated": 2
}

### GET /rooms/{id}/housekeeping-history

Response
{
  "room": {
    "id": 101,
    "number": "301",
    "housekeeping_status": "clean"
  },
  "data": [
    {"id": 1, "from_status": "dirty", "to_status": "clean", "changed_at": "2026-02-14T07:00:00Z"}
  ]
}

## Cashier Shifts

### POST /cashier-shifts/open

Request
{
  "opening_cash": 20000,
  "currency": "MMK",
  "notes": "Morning shift"
}

Response
{
  "id": 31,
  "status": "open",
  "currency": "MMK",
  "opening_cash": 20000,
  "opened_at": "2026-02-14T01:00:00Z"
}

### POST /cashier-shifts/{id}/close

Request
{
  "closing_cash": 19500,
  "notes": "End of shift"
}

Response
{
  "id": 31,
  "status": "closed",
  "total_cash": 10000,
  "total_card": 5000,
  "expected_cash": 20000,
  "variance": -500,
  "closed_at": "2026-02-14T09:00:00Z"
}

### GET /cashier-shifts/current

Response
{
  "data": {
    "id": 31,
    "status": "open",
    "opening_cash": 20000,
    "opened_at": "2026-02-14T01:00:00Z"
  }
}

## Reports

### GET /reports/occupancy

Query
- from=2026-02-01
- to=2026-02-28

Response
{
  "from": "2026-02-01",
  "to": "2026-02-28",
  "occupancy": 0.78,
  "adr": 85000,
  "revpar": 66300
}

### GET /reports/cashier-shift

Query
- date=2026-02-14
- cashier_id=12

Response
{
  "date": "2026-02-14",
  "cashier": {"id": 12, "name": "Front Desk"},
  "total_cash": 150000,
  "total_card": 50000
}

## Admin

### GET /users

Response
{
  "data": [
    {"id": 12, "name": "Front Desk", "role": "front_desk"}
  ]
}

### POST /users

Request
{
  "name": "Supervisor",
  "email": "sup@hotel.com",
  "role": "supervisor",
  "password": "secret"
}

Response
{
  "id": 15,
  "name": "Supervisor",
  "role": "supervisor"
}

### GET /abac/policies

Response
{
  "data": [
    {"id": 1, "name": "reservation.update", "is_active": true}
  ]
}

### POST /abac/policies

Request
{
  "name": "reservation.update",

## System Updates & Diagnostics

### POST /system/updates/check

Response
{
  "current_version": "1.0.0",
  "latest_version": "1.2.0",
  "has_update": true,
  "release": {
    "tag_name": "v1.2.0",
    "html_url": "https://github.com/org/repo/releases/tag/v1.2.0"
  }
}

### POST /system/updates/apply

Request
{
  "release_tag": "v1.2.0",
  "version_to": "1.2.0",
  "notes": "Blue/green deploy"
}

Response
{
  "update_id": 12,
  "status": "queued"
}

### POST /system/updates/rollback

Request
{
  "update_id": 12,
  "confirm_db_restore": true
}

Response
{
  "update_id": 12,
  "status": "rollback_queued"
}

### POST /system/backups

Request
{
  "reason": "Pre-update backup"
}

Response
{
  "backup_id": 44,
  "status": "completed"
}

### POST /system/reports/errors

Request
{
  "title": "Crash on dashboard",
  "severity": "high",
  "message": "Steps to reproduce...",
  "trace_id": "trace-123",
  "url": "http://127.0.0.1:8000/dashboard",
  "app_version": "1.0.0",
  "payload": {"stack": "..."}
}

Response
{
  "report_id": 31,
  "status": "sent",
  "github_issue_url": "https://github.com/org/repo/issues/31"
}
  "rules": {
    "effect": "allow",
    "conditions": [
      {"left": "user.property_id", "op": "==", "right": "resource.property_id"}
    ]
  }
}

Response
{
  "id": 1,
  "name": "reservation.update",
  "is_active": true
}
