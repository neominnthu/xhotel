# ABAC Role-by-Role Rule Matrix (Aligned to Screens)

Roles: front_desk, reservation_manager, housekeeping, cashier, admin.
Resources: reservation, stay, room, folio, payment, report, user, policy, settings.
Actions: view, create, update, cancel, check_in, check_out, post_charge, post_payment.

## Core Principles

- Deny by default.
- Property scope must match user.property_id.
- Admin has full access unless explicitly restricted by policy.

## Matrix (High Level)

### Front Desk

- reservation: view, create, update (no rate override), cancel (only if no payment)
- stay: check_in, check_out (only if folio balance is zero)
- room: view, assign (available only)
- folio: view, post_charge (non-sensitive types)
- payment: view
- report: view limited daily occupancy

### Reservation Manager

- reservation: view, create, update, cancel
- stay: check_in, check_out (override allowed)
- room: view, assign, move
- folio: view, post_charge
- payment: view
- report: view and export all reservation-related reports

### Housekeeping

- reservation: view limited fields (dates, room)
- stay: view only
- room: view, update housekeeping_status
- housekeeping_task: view, create, update
- report: view housekeeping SLA

### Cashier

- reservation: view
- stay: check_out (with payment)
- folio: view, post_charge (fees only), post_payment, refund (with approval)
- payment: view
- report: view cashier shift

### Admin

- all resources: full access

## ABAC Rules (Examples)

### reservation.update

- allow if user.role in [front_desk, reservation_manager, admin]
- deny if resource.status == checked_out
- deny if user.role == front_desk and resource.has_payment == true

### stay.check_in

- allow if user.role in [front_desk, reservation_manager, admin]
- deny if resource.status != expected
- deny if room.status != available

### stay.check_out

- allow if user.role in [cashier, reservation_manager, admin]
- deny if resource.status != checked_in
- deny if folio.balance > 0 and no payment provided

### folio.post_payment

- allow if user.role in [cashier, admin]
- deny if folio.status == closed

### room.update_housekeeping_status

- allow if user.role in [housekeeping, admin]
- deny if room.status == out_of_order and user.role != admin

## Field-Level Restrictions

- front_desk cannot edit rate_plan_id or discount fields
- cashier cannot edit reservation dates or room assignment
- housekeeping cannot view guest ID numbers

## Audit Requirements

- Log all denied actions
- Log all overrides by reservation_manager or admin
