# Role-Based Test Data Seed Plan

This plan defines minimal seed data for contract tests and role validation.

## Property

- One property with default currency MMK and language my.

## Users

- admin@hotel.com (role: admin)
- fd@hotel.com (role: front_desk)
- rm@hotel.com (role: reservation_manager)
- hk@hotel.com (role: housekeeping)
- cs@hotel.com (role: cashier)

## Room Types and Rooms

- RoomType: Standard (id 1), Deluxe (id 2)
- Rooms: 101, 102 (Standard), 201, 202 (Deluxe)
- Room status: 101 available, 102 occupied, 201 out_of_order, 202 available

## Rate Plans

- BAR-MMK (MMK), Corporate-MMK (MMK)

## Guests

- Guest A: Aye Aye (phone +959123456)
- Guest B: Min Min (phone +959555555)

## Reservations

- Reservation R1: confirmed, room_type Deluxe, no payment
- Reservation R2: confirmed, room assigned 102, has payment
- Reservation R3: checked_in, stay active
- Reservation R4: checked_out

## Stays

- Stay S1 for R3: checked_in, assigned room 101
- Stay S2 for R4: checked_out

## Folios

- Folio F1 for R1: open, balance > 0
- Folio F2 for R2: open, balance 0
- Folio F3 for R4: closed

## Housekeeping Tasks

- Task T1: room 101 clean, open
- Task T2: room 102 maintenance, in_progress

## ABAC Policies

- Apply default role-based policies from [developer-reference/29-abac-policy-examples.md](developer-reference/29-abac-policy-examples.md)

## Payment Methods

- cash, card, transfer

## Notes

- Ensure each role has a valid token for tests.
- Keep seed data stable to avoid flaky tests.
