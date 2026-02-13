# Postman Collection Templates (v1)

This document describes the collection structure, folders, and base request templates.
Use it to build actual Postman JSON files.

## Collection: XHotel PMS API

### Variables

- baseUrl: http://localhost
- apiPrefix: /api/v1
- token: <bearer>
- propertyId: 1
- reservationId: 1201
- stayId: 9001
- folioId: 7001
- roomId: 101
- userId: 12

### Common Headers

- Authorization: Bearer {{token}}
- Content-Type: application/json

## Folder 01-auth

### Request: Login

- Method: POST
- URL: {{baseUrl}}{{apiPrefix}}/auth/login
- Body:
{
  "email": "agent@hotel.com",
  "password": "secret"
}
- Tests:
  - Expect 200
  - Save token from response

### Request: Logout

- Method: POST
- URL: {{baseUrl}}{{apiPrefix}}/auth/logout
- Tests:
  - Expect 200

## Folder 02-reservations

### Request: List

- Method: GET
- URL: {{baseUrl}}{{apiPrefix}}/reservations?filter[status]=confirmed
- Tests:
  - Expect 200

### Request: Create

- Method: POST
- URL: {{baseUrl}}{{apiPrefix}}/reservations
- Body:
{
  "guest": {"name": "Aye Aye", "phone": "+959123456"},
  "check_in": "2026-02-14",
  "check_out": "2026-02-16",
  "room_type_id": 3,
  "adults": 2,
  "children": 0,
  "source": "walk_in"
}
- Tests:
  - Expect 200
  - Save reservationId

### Request: Update

- Method: PATCH
- URL: {{baseUrl}}{{apiPrefix}}/reservations/{{reservationId}}
- Body:
{
  "check_out": "2026-02-17"
}
- Tests:
  - Expect 200

### Request: Cancel

- Method: POST
- URL: {{baseUrl}}{{apiPrefix}}/reservations/{{reservationId}}/cancel
- Body:
{
  "reason": "Guest no show"
}
- Tests:
  - Expect 200

## Folder 03-front-desk

### Request: Check-in

- Method: POST
- URL: {{baseUrl}}{{apiPrefix}}/stays/{{stayId}}/check-in
- Body:
{
  "room_id": {{roomId}},
  "deposit": {"amount": 50000, "currency": "MMK"}
}
- Tests:
  - Expect 200

### Request: Check-out

- Method: POST
- URL: {{baseUrl}}{{apiPrefix}}/stays/{{stayId}}/check-out
- Body:
{
  "payment": {"method": "cash", "amount": 150000, "currency": "MMK"}
}
- Tests:
  - Expect 200

## Folder 04-folios

### Request: Get Folio

- Method: GET
- URL: {{baseUrl}}{{apiPrefix}}/folios/{{folioId}}

### Request: Post Charge

- Method: POST
- URL: {{baseUrl}}{{apiPrefix}}/folios/{{folioId}}/charges
- Body:
{
  "type": "minibar",
  "description": "Snacks",
  "amount": 8000,
  "currency": "MMK",
  "tax_amount": 400
}
- Tests:
  - Expect 200

### Request: Post Payment

- Method: POST
- URL: {{baseUrl}}{{apiPrefix}}/folios/{{folioId}}/payments
- Body:
{
  "method": "card",
  "amount": 100000,
  "currency": "MMK",
  "exchange_rate": 1,
  "reference": "KBZ-123456"
}
- Tests:
  - Expect 200

### Request: Statement

- Method: GET
- URL: {{baseUrl}}{{apiPrefix}}/folios/{{folioId}}/statement

## Folder 05-housekeeping

### Request: List Tasks

- Method: GET
- URL: {{baseUrl}}{{apiPrefix}}/housekeeping/tasks?filter[status]=open

### Request: Update Task

- Method: PATCH
- URL: {{baseUrl}}{{apiPrefix}}/housekeeping/tasks/{{taskId}}
- Body:
{
  "status": "completed"
}
- Tests:
  - Expect 200

## Folder 06-reports

### Request: Occupancy

- Method: GET
- URL: {{baseUrl}}{{apiPrefix}}/reports/occupancy?from=2026-02-01&to=2026-02-28

### Request: Cashier Shift

- Method: GET
- URL: {{baseUrl}}{{apiPrefix}}/reports/cashier-shift?date=2026-02-14&cashier_id={{userId}}

## Folder 07-admin

### Request: List Users

- Method: GET
- URL: {{baseUrl}}{{apiPrefix}}/users

### Request: Create User

- Method: POST
- URL: {{baseUrl}}{{apiPrefix}}/users
- Body:
{
  "name": "Supervisor",
  "email": "sup@hotel.com",
  "role": "supervisor",
  "password": "secret"
}

### Request: List ABAC Policies

- Method: GET
- URL: {{baseUrl}}{{apiPrefix}}/abac/policies

### Request: Create ABAC Policy

- Method: POST
- URL: {{baseUrl}}{{apiPrefix}}/abac/policies
- Body:
{
  "name": "reservation.update",
  "rules": {
    "effect": "allow",
    "conditions": [
      {"left": "user.property_id", "op": "==", "right": "resource.property_id"}
    ]
  }
}
