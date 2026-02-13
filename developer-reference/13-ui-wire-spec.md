# Page-by-Page UI Wire Spec with Component Mapping

This document defines UI layouts, components, and interaction patterns for core pages.
All pages share the global layout unless specified.

## Global Layout

- Top nav: property selector (single property), language switch, user menu
- Left sidebar: primary navigation
- Content area: page header + body
- Page header: title, breadcrumbs (optional), primary action buttons on right

## Shared Components

- AppShell
- PageHeader
- StatCard
- FilterBar
- DataTable
- StatusBadge
- PrimaryButton, SecondaryButton, DangerButton
- Modal, Drawer
- FormInput, FormSelect, FormDate, FormTextarea
- EmptyState, LoadingSkeleton, Toast

## Dashboard

### Layout

- Header: Dashboard + Date range selector
- Body: 3 stat cards row, 2-column chart row, recent activity table

### Components

- StatCard (Occupancy, ADR, RevPAR)
- ChartLine (occupancy trend)
- ChartBar (revenue by source)
- DataTable (recent check-ins/check-outs)

### Actions

- Quick actions: New reservation, Check-in, Post payment

## Reservations List

### Layout

- Header: Reservations + New Reservation button
- Body: FilterBar + DataTable + Pagination

### Components

- FilterBar (status, date range, source, room type)
- DataTable columns: Code, Guest, Check-in, Check-out, Status, Room, Source, Actions
- StatusBadge for status

### Actions

- Row actions: View, Edit, Cancel
- Bulk export CSV

## Reservation Detail

### Layout

- Header: Reservation code + status
- Body: Summary cards + tabs (Details, Guests, Folio, Notes)

### Components

- SummaryCard (dates, nights, room, guests)
- Tabs
- Form sections for editing
- DataTable for guests
- FolioPanel for charges and payments

### Actions

- Primary: Check-in
- Secondary: Modify, Cancel, Add guest, Add note

## New Reservation (Wizard)

### Layout

- Stepper: Guest -> Stay -> Room -> Payment -> Review

### Components

- Stepper
- FormInput and FormDate
- RoomAvailabilityTable
- PaymentForm

### Validation

- Validate each step before moving forward
- Show inline error messages

## Check-in Wizard

### Layout

- Stepper: Verify -> Assign Room -> Deposit -> Confirm

### Components

- GuestCard
- RoomAvailabilityTable
- PaymentForm
- ConfirmationSummary

### Actions

- Confirm check-in

## Check-out Wizard

### Layout

- Stepper: Review Folio -> Payment -> Confirm

### Components

- FolioPanel
- PaymentForm
- ConfirmationSummary

### Actions

- Post payment
- Confirm check-out

## Room Calendar

### Layout

- Header: Room Calendar + Date range
- Body: Room grid calendar with occupancy

### Components

- CalendarGrid
- StatusBadge

### Actions

- Create reservation from cell

## Housekeeping Board

### Layout

- Header: Housekeeping + Filters
- Body: Kanban columns (Open, In Progress, Completed)

### Components

- KanbanBoard
- TaskCard
- FilterBar

### Actions

- Assign task
- Mark complete

## Room Status

### Layout

- Header: Room Status
- Body: Grid of room cards

### Components

- RoomCard with status and housekeeping state
- FilterBar

### Actions
n
- Update status
- Create maintenance task

## Folio Statement

### Layout

- Header: Folio Statement + Print/Export
- Body: Summary + line items table

### Components

- SummaryCard
- DataTable

### Actions

- Export PDF/CSV

## Reports

### Layout

- Header: Reports
- Body: Report list + report view panel

### Components

- ReportList
- FilterBar
- ChartBar/ChartLine
- DataTable

### Actions

- Export PDF/CSV

## Users and Roles

### Layout

- Header: Users
- Body: DataTable + user drawer

### Components

- DataTable
- Drawer (UserForm)
- RoleSelect

### Actions

- Create user
- Reset password

## ABAC Policies

### Layout

- Header: ABAC Policies
- Body: Policy list + editor drawer

### Components

- DataTable
- JsonEditor
- Drawer

### Actions

- Add policy
- Toggle active

## Settings

### Layout

- Header: Settings
- Body: Tabs (Cancellation Policies, Room Types, Rates)

### Components

- Tabs
- DataTable
- FormInput
- FormSelect

### Actions

- Create and update cancellation policies, room types, and rates
- Delete room types and rates with confirmation
- Show inline validation errors for overlapping active rate date ranges

## Notifications and Error States

- Toasts for success and warnings
- Inline error panels for validation
- EmptyState for no data
- LoadingSkeleton for async data
