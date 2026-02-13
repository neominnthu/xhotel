# Role-Based Acceptance Criteria per Screen (v1)

Roles used: front_desk, reservation_manager, housekeeping, cashier, admin.
All rules assume ABAC is enabled.

## Dashboard

- front_desk: view occupancy and arrivals only; no revenue tiles.
- reservation_manager: view all tiles and trends.
- housekeeping: view room status tiles only.
- cashier: view revenue and shift tiles only.
- admin: view all tiles and audit widgets.

## Reservations List

- front_desk: can view and create reservations; cannot cancel confirmed with payment.
- reservation_manager: can create, edit, cancel all reservations per policy.
- housekeeping: view-only with limited fields.
- cashier: view-only, no edit.
- admin: full access.

## Reservation Detail

- front_desk: can check-in and add notes; cannot edit rate plan.
- reservation_manager: full edit, cancel, and room move.
- housekeeping: view room assignment and dates only.
- cashier: view folio only.
- admin: full access.

## New Reservation (Wizard)

- front_desk: can create walk-in and phone; cannot create corporate without approval.
- reservation_manager: can create all sources.
- cashier: no access.
- housekeeping: no access.
- admin: full access.

## Check-in Wizard

- front_desk: can check-in and collect deposit.
- reservation_manager: can check-in.
- cashier: can post deposit only if assigned.
- housekeeping: no access.
- admin: full access.

## Check-out Wizard

- front_desk: can check-out if balance is zero.
- cashier: can take payments and finalize check-out.
- reservation_manager: can check-out with override.
- housekeeping: no access.
- admin: full access.

## Room Calendar

- front_desk: view and create reservations from empty cell.
- reservation_manager: full edit and drag changes.
- housekeeping: view-only.
- cashier: no access.
- admin: full access.

## Housekeeping Board

- housekeeping: full access to task updates.
- front_desk: view-only.
- reservation_manager: view-only.
- cashier: no access.
- admin: full access.

## Room Status

- housekeeping: can update housekeeping status.
- front_desk: can mark out_of_order with approval.
- reservation_manager: view-only.
- cashier: no access.
- admin: full access.

## Folio Statement

- cashier: full access to post payments and refunds.
- front_desk: can view and print.
- reservation_manager: view-only.
- housekeeping: no access.
- admin: full access.

## Reports

- reservation_manager: view and export occupancy and ADR.
- cashier: view and export cashier shift.
- front_desk: view limited daily occupancy.
- housekeeping: view housekeeping SLA only.
- admin: full access.

## Users and Roles

- admin: full access.
- all others: no access.

## ABAC Policies

- admin: full access.
- all others: no access.

## Settings

- admin: full access.
- reservation_manager: create, update, and delete room types, rates, and cancellation policies.
- all others: no access.
