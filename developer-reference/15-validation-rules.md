# Validation Rules per Endpoint (v1)

All timestamps are UTC. Dates use ISO 8601.
Unless noted, all fields are required.

## Auth

### POST /auth/login

- email: required, email, max:120
- password: required, min:6, max:72

## Properties

### GET /properties/current

- No input

## Rooms and Room Types

### GET /room-types

- No input

### GET /rooms

- filter[status]: optional, in: available, occupied, out_of_order
- filter[room_type_id]: optional, integer, exists:room_types,id

### PATCH /rooms/{id}/assign

- path id: required, integer, exists:rooms,id
- reservation_id: required, integer, exists:reservations,id
- room must be available
- reservation status must be confirmed or pending

## Availability

### GET /availability

- room_type_id: required, integer, exists:room_types,id
- check_in: required, date
- check_out: required, date, after:check_in
- quantity: optional, integer, min:1, max:5

### POST /availability/holds

- room_type_id: required, integer, exists:room_types,id
- room_id: optional, integer, exists:rooms,id
- check_in: required, date, after_or_equal:today
- check_out: required, date, after:check_in
- quantity: optional, integer, min:1, max:5
- expires_in_minutes: optional, integer, min:5, max:60

### DELETE /availability/holds/{id}

- path id: required, integer, exists:availability_holds,id

## Settings (Web)

### POST /settings/room-types

- name_en: required, string, max:120
- name_my: required, string, max:120
- capacity: required, integer, min:1, max:20
- overbooking_limit: required, integer, min:0, max:50
- base_rate: required, integer, min:0
- sort_order: optional, integer, min:0, max:999
- is_active: optional, boolean

### PATCH /settings/room-types/{roomType}

- name_en: required, string, max:120
- name_my: required, string, max:120
- capacity: required, integer, min:1, max:20
- overbooking_limit: required, integer, min:0, max:50
- base_rate: required, integer, min:0
- sort_order: optional, integer, min:0, max:999
- is_active: optional, boolean

### POST /settings/rates

- room_type_id: required, integer, exists:room_types,id
- name: required, string, max:120
- type: required, in: base, seasonal, special
- start_date: required, date
- end_date: required, date, after_or_equal:start_date
- rate: required, integer, min:0
- min_stay: required, integer, min:1, max:30
- days_of_week: optional, array
- days_of_week.*: integer, min:1, max:7
- length_of_stay_min: optional, integer, min:1, max:60
- length_of_stay_max: optional, integer, min:1, max:60
- adjustment_type: optional, in: override, percent, amount
- adjustment_value: optional, integer, min:0
- is_active: optional, boolean
- active rate date ranges must not overlap for same room_type_id and type

### POST /settings/cancellation-policies

- name: required, string, max:120
- room_type_id: optional, integer, exists:room_types,id
- deadline_hours: required, integer, min:0, max:720
- penalty_type: required, in: flat, percent, first_night
- penalty_amount: required_if:penalty_type,flat, integer, min:0
- penalty_percent: required_if:penalty_type,percent, integer, between:0,100
- is_active: optional, boolean

### PATCH /settings/rates/{rate}

- room_type_id: required, integer, exists:room_types,id
- name: required, string, max:120
- type: required, in: base, seasonal, special
- start_date: required, date
- end_date: required, date, after_or_equal:start_date
- rate: required, integer, min:0
- min_stay: required, integer, min:1, max:30
- days_of_week: optional, array
- days_of_week.*: integer, min:1, max:7
- length_of_stay_min: optional, integer, min:1, max:60
- length_of_stay_max: optional, integer, min:1, max:60
- adjustment_type: optional, in: override, percent, amount
- adjustment_value: optional, integer, min:0
- is_active: optional, boolean
- active rate date ranges must not overlap for same room_type_id and type (excluding current rate)

### POST /settings/exchange-rates

- base_currency: required, string, size:3
- quote_currency: required, string, size:3, different:base_currency
- rate: required, numeric, min:0.000001
- effective_date: required, date, unique per property/base/quote/date
- source: optional, string, max:64
- is_active: optional, boolean

### PATCH /settings/exchange-rates/{exchangeRate}

- base_currency: required, string, size:3
- quote_currency: required, string, size:3, different:base_currency
- rate: required, numeric, min:0.000001
- effective_date: required, date, unique per property/base/quote/date (excluding current exchange rate)
- source: optional, string, max:64
- is_active: optional, boolean

## Reservations

### GET /reservations

- filter[status]: optional, in: pending, confirmed, checked_in, checked_out, canceled, no_show
- filter[check_in]: optional, date
- sort: optional, in: check_in, -check_in, check_out, -check_out, created_at, -created_at

### POST /reservations

- guest.name: required, string, max:120
- guest.phone: optional, string, max:32
- guest.id_type: optional, in: nrc, passport, other
- guest.id_number: optional, string, max:64
- check_in: required, date, after_or_equal:today
- check_out: required, date, after:check_in
- room_type_id: required, integer, exists:room_types,id
- adults: required, integer, min:1, max:10
- children: optional, integer, min:0, max:10
- source: required, in: walk_in, phone, ota, corporate
- special_requests: optional, string, max:500

### PATCH /reservations/{id}

- path id: required, integer, exists:reservations,id
- check_in: optional, date, after_or_equal:today
- check_out: optional, date, after:check_in
- adults: optional, integer, min:1, max:10
- children: optional, integer, min:0, max:10
- room_id: optional, integer, exists:rooms,id
- special_requests: optional, string, max:500
- status updates require ABAC and must follow state rules

### POST /reservations/{id}/cancel

- path id: required, integer, exists:reservations,id
- reason: required, string, min:3, max:255
- cancellation policy rules apply

## Stays

### POST /stays/{id}/check-in

- path id: required, integer, exists:stays,id
- room_id: required, integer, exists:rooms,id
- deposit.amount: optional, integer, min:0
- deposit.currency: optional, string, size:3
- stay status must be expected
- room must be available

### POST /stays/{id}/check-out

- path id: required, integer, exists:stays,id
- payment.method: required, in: cash, card, transfer
- payment.amount: required, integer, min:0
- payment.currency: required, string, size:3
- payment.exchange_rate: optional, numeric, min:0.000001
- stay status must be checked_in

### POST /front-desk/stays/{id}/extend

- path id: required, integer, exists:stays,id
- check_out: required, date, after:today
- stay status must be checked_in
- check_out must be after current reservation check_out

## Folios, Charges, Payments

### GET /folios/{id}

- path id: required, integer, exists:folios,id

### POST /folios/{id}/charges

- path id: required, integer, exists:folios,id
- type: required, string, max:32
- description: optional, string, max:255
- amount: required, integer, min:0
- currency: required, string, size:3
- tax_amount: optional, integer, min:0
- folio must be open

### POST /folios/{id}/payments

- path id: required, integer, exists:folios,id
- method: required, in: cash, card, transfer
- amount: required, integer, min:0
- currency: required, string, size:3
- exchange_rate: optional, numeric, min:0.000001
- reference: optional, string, max:64
- folio must be open

### POST /folios/{id}/refunds

- path id: required, integer, exists:folios,id
- method: required, in: cash, card, bank_transfer, digital_wallet, check, voucher, other
- amount: required, integer, min:1
- currency: required, string, size:3
- exchange_rate: optional, numeric, min:0.000001
- reference: optional, string, max:64
- reason: optional, string, max:255
- payment_id: optional, integer, exists:payments,id
- folio balance must be zero

### POST /refunds/{id}/approve

- path id: required, integer, exists:refunds,id
- reference: optional, string, max:64
- refund status must be pending

### GET /folios/{id}/statement

- path id: required, integer, exists:folios,id

## Housekeeping

### GET /housekeeping/tasks

- filter[status]: optional, in: open, in_progress, completed
- filter[priority]: optional, in: low, normal, high
- filter[room_id]: optional, integer, exists:rooms,id
- filter[assigned_to]: optional, integer (or literal 'unassigned'), exists:users,id
- filter[room_status]: optional, in: clean, dirty, inspected
- filter[due_from]: optional, date
- filter[due_to]: optional, date
- filter[type]: optional, in: clean, inspect, maintenance
- filter[completed_from]: optional, date
- filter[completed_to]: optional, date
- filter[overdue]: optional, boolean
- filter[sort]: optional, in: due_at, priority, room_number
- filter[sort_dir]: optional, in: asc, desc
- page: optional, integer, min:1
- per_page: optional, integer, min:1, max:100

### POST /housekeeping/tasks

- room_id: required, integer, exists:rooms,id
- type: required, in: clean, inspect, maintenance
- priority: optional, in: low, normal, high
- assigned_to: optional, integer, exists:users,id
- due_at: optional, date

### PATCH /housekeeping/tasks/{id}

- path id: required, integer, exists:housekeeping_tasks,id
- status: required, in: open, in_progress, completed

### PATCH /housekeeping/tasks/bulk

- task_ids: required, array, min:1
- task_ids.*: required, integer, exists:housekeeping_tasks,id
- status: optional, in: open, in_progress, completed
- assigned_to: optional, integer, exists:users,id
- at least one of status or assigned_to is required

### GET /rooms/{id}/housekeeping-history

- path id: required, integer, exists:rooms,id

## Cashier Shifts

### POST /cashier-shifts/open

- opening_cash: required, integer, min:0
- currency: optional, string, size:3
- notes: optional, string, max:255

### POST /cashier-shifts/{id}/close

- path id: required, integer, exists:cashier_shifts,id
- closing_cash: required, integer, min:0
- notes: optional, string, max:255

### GET /cashier-shifts/current

- No input

## Reports

### GET /reports/occupancy

- from: required, date
- to: required, date, after_or_equal:from

### GET /reports/cashier-shift

- date: required, date
- cashier_id: required, integer, exists:users,id

## Admin

### GET /users

- No input

### POST /users

- name: required, string, max:120
- email: required, email, max:120, unique:users,email
- role: required, string, max:64
- password: required, string, min:8, max:72

### GET /abac/policies

- No input

### POST /abac/policies

- name: required, string, max:120
- rules: required, json object

## System Updates & Diagnostics

### POST /system/updates/check

- No input

### POST /system/updates/apply

- release_tag: optional, string, max:64
- version_to: optional, string, max:32
- notes: optional, string, max:255

### POST /system/updates/rollback

- update_id: optional, integer, exists:system_updates,id
- confirm_db_restore: optional, boolean

### POST /system/backups

- reason: optional, string, max:255

### POST /system/reports/errors

- title: required, string, max:200
- severity: optional, in: low, medium, high, critical
- message: optional, string, max:2000
- trace_id: optional, string, max:64
- url: optional, string, max:255
- app_version: optional, string, max:32
- payload: optional, array
