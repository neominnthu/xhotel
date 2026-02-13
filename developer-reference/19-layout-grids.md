# High-Fidelity Layout Grids (v1)

This document defines layout grids and spacing for each page type.
Use the shared design system tokens from [developer-reference/08-frontend-design-system.md](developer-reference/08-frontend-design-system.md).

## Global Grid

- Desktop: 12-column grid, 24px gutter, 32px margin
- Tablet: 8-column grid, 20px gutter, 24px margin
- Mobile: 4-column grid, 16px gutter, 16px margin
- Base spacing scale: 4, 8, 12, 16, 24, 32

## Dashboard

- Row 1: 3 StatCards, each spans 4 columns (desktop)
- Row 2: ChartLine spans 7 columns, ChartBar spans 5 columns
- Row 3: DataTable spans 12 columns

## List Pages (Reservations, Users, Room Types)

- FilterBar spans 12 columns
- DataTable spans 12 columns
- Pagination aligned right in table footer

## Detail Pages (Reservation Detail)

- Summary cards row: 3 cards x 4 columns
- Tabs row: 12 columns
- Tab content: two-column split, 7/5 columns for details and side panel

## Wizard Pages (Check-in, Check-out, New Reservation)

- Stepper spans 12 columns
- Form body spans 7 columns, summary panel spans 5 columns
- Mobile: all content stacked

## Calendar View

- Header spans 12 columns
- Calendar grid spans 12 columns, with sticky first column for room numbers

## Housekeeping Board

- Kanban columns: 3 columns x 4 columns each
- Mobile: stacked columns

## Reports

- Filters row: 12 columns
- Chart row: two charts 6/6 columns
- Table row: 12 columns

## Settings

- Tabs row: 12 columns
- Tab content: table and editor split 7/5 columns

## Accessibility Spacing

- Minimum clickable target: 40px height
- Focus ring: 2px outline on active elements
