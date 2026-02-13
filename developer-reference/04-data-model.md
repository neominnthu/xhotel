# Data Model (Core)

## Common Fields

- id (int, PK) for internal joins
- uuid (char(36), unique) for external references
- created_at, updated_at, deleted_at

## Property

- id, name, address, timezone
- default_currency, default_language
- receipt_header, tax_id, phone

## RoomType

- id, property_id, name, capacity
- base_rate, amenities_json
- sort_order, is_active

## Room

- id, property_id, room_type_id
- number, floor, status
- housekeeping_status, is_active

## RatePlan

- id, property_id, name
- currency, base_rate
- rules_json
- cancellation_policy_json

## Guest

- id, name, phone, email
- id_type, id_number
- nationality, address, notes

## Reservation

- id, property_id, code, status
- source, check_in, check_out
- guest_id, room_type_id, room_id
- adults, children, special_requests

## Stay

- id, reservation_id, status
- actual_check_in, actual_check_out
- assigned_room_id

## Folio

- id, reservation_id
- currency, total, balance
- status, closed_at

## Charge

- id, folio_id
- type, amount, currency
- tax_amount, description
- posted_at, created_by

## Payment

- id, folio_id
- method, amount, currency
- exchange_rate, reference
- received_at, created_by

## HousekeepingTask

- id, room_id, status
- assigned_to, due_at
- priority, completed_at

## User

- id, name, email
- role_id
- department, is_active

## ABACPolicy

- id, name, rules_json
- is_active

## AuditLog

- id, user_id, action
- resource, payload, created_at
- ip_address, user_agent

## Supporting Tables

## Tax

- id, property_id, name, rate, type (percent|flat), is_active

## Fee

- id, property_id, name, amount, type (percent|flat), is_active

## ExchangeRate

- id, base_currency, quote_currency, rate, effective_at

## ReservationGuest

- reservation_id, guest_id, is_primary

## RoomStatusLog

- room_id, from_status, to_status, changed_by, changed_at

## PaymentMethod

- id, property_id, name, type (cash|card|transfer), is_active

## Relationships (Summary)

- Property has many RoomType, Room, RatePlan, Tax, Fee
- Reservation belongs to Guest, RoomType, Room (optional)
- Reservation has one Stay and one or more Folios
- Folio has many Charge and Payment
- Room has many HousekeepingTask and RoomStatusLog

## Indexing Guidelines

- Unique: reservation.code, room.number (per property)
- Index: reservation.check_in, reservation.check_out, stay.status
- Index: charge.posted_at, payment.received_at

