# Screen-by-Screen Acceptance Criteria (v1)

All criteria must pass in Myanmar and English locales.

## Dashboard

- Shows occupancy, ADR, RevPAR for selected date range.
- Recent activity lists check-ins and check-outs.
- Quick actions open the correct flows.

## Reservations List

- Filters by status, date, source, room type.
- Sorting works on check-in/out and created date.
- Row actions: view, edit, cancel.

## Reservation Detail

- Summary shows nights, room, and guest count.
- Tabs load without full page reload.
- Check-in button is disabled if status not confirmed.

## New Reservation (Wizard)

- Stepper blocks progression until current step validates.
- Room availability updates on date change.
- Review step shows full booking summary.

## Check-in Wizard

- Must assign a room before confirm.
- Deposit posts to folio when provided.
- Status changes to checked_in after confirmation.

## Check-out Wizard

- Shows all charges and payments.
- Blocks check-out if balance is not zero.
- Status changes to checked_out after confirmation.

## Room Calendar

- Displays occupancy by room and date.
- Create reservation from empty cell.

## Housekeeping Board

- Tasks move between columns with drag or action.
- Completed tasks show timestamp.

## Room Status

- Room cards show current status and housekeeping state.
- Status update writes log entry.

## Folio Statement

- Statement includes all charges and payments.
- Export to PDF/CSV works.

## Reports

- Filters update charts and tables.
- Export includes visible filters in header.

## Users and Roles

- Create user requires email and password.
- Role changes take effect immediately.

## ABAC Policies

- Policy editor validates JSON.
- Deactivated policy does not apply to new requests.

## Settings

- Tabs show Cancellation Policies, Room Types, and Rates.
- Room types can be created, edited, and soft-deleted with confirmation.
- Rates can be created, edited, and deleted with confirmation.
- Active rate date ranges cannot overlap for the same room type and rate type.
