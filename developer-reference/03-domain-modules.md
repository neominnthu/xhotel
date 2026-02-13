# Domain Modules

## Master Data

- Property profile, taxes, fees
- Room types and rooms
- Rate plans and policies

### Key Rules

- Room numbers are unique per property.
- Rate plans define pricing rules and cancellation policies.
- Taxes and fees can be flat or percentage.

## Reservations

- Booking lifecycle: create, modify, cancel
- Sources: walk-in, phone, OTA
- Prepayment and deposit rules

### Reservation Status

- pending, confirmed, checked_in, checked_out, canceled, no_show

### Core Workflows

- Create reservation with hold or payment
- Modify dates/guests/room type with audit trail
- Cancel with fee rules based on policy

## Front Desk

- Check-in/check-out
- Room assignment and moves
- Status tracking

### Room Status

- clean, dirty, inspected, out_of_order

### Operational Needs

- Quick search by guest name, phone, code
- Check-in wizard with ID capture and deposit
- Room move with availability validation

## Billing and Folio

- Charges, payments, refunds
- Split folio support
- Multi-currency handling

### Billing Rules

- All charges are posted to a folio with tax breakdown
- Service charge can be applied to accommodation charges before tax
- Totals may be rounded based on configured rounding rules
- Payments can be split across methods and currencies
- Refunds require supervisor approval (ABAC)

## Housekeeping

- Task creation and assignment
- Status: clean, dirty, inspected
- Maintenance tickets

### Task Types

- clean, inspect, maintenance

### SLAs

- Tasks are prioritized by check-in and status changes

## Reports

- Occupancy, ADR, RevPAR
- Cashier shift summary
- Daily audit

### Report Requirements

- Export to CSV/PDF
- Filter by date range, room type, source

## Admin

- Users, roles, ABAC policies
- System settings
- Audit logs

### Admin Capabilities

- User onboarding and role assignment
- Configure taxes, fees, and receipt headers
- Control ABAC policies by role and department

