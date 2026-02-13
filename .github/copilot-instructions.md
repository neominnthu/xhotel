# Copilot Instructions for XHotel PMS

Use this file as guidance when generating code or making changes.
Since Targeting to develop the best Hotel PMS application than top 10 applications same industories in global market.
## Product and Scope

- Follow developer references in developer-reference/ as the source of truth.
- Default language is Myanmar; English is secondary.
- Single-tenant deployment (one property per installation).
- Core modules first: reservations, front desk, billing, housekeeping, reporting, admin.
- Future modules (restaurant, spa, KTV, smart-lock) are out of scope for v1.

## Backend (Laravel 12)

- Use Form Requests for validation and policies for ABAC enforcement.
- Store money as integer units (MMK has no minor unit).
- Always audit sensitive actions (payments, refunds, policy changes).
- Prefer service classes for domain logic (no fat controllers).
- Use migrations, factories, and seeders.

## Frontend (Inertia + React + TS)

- Use Inertia pages in resources/js/pages.
- Use shared components in resources/js/components.
- Keep layout consistent with the design system.
- Ensure keyboard-first workflows and focus order specs are respected.

## Styling

- Tailwind CSS is the standard.
- Use tokens from the design system (developer-reference/08-frontend-design-system.md).

## Testing and Quality

- Backend: PHPUnit feature tests for core flows.
- Frontend: React Testing Library for forms and tables.
- Follow validation rules in developer-reference/15-validation-rules.md.
- Follow error codes in developer-reference/16-error-codes.md.

## API

- Reference developer-reference/14-openapi.yaml and 11-api-endpoint-specs.md.
- Use consistent error response format with code and message.

## Conventions

- Keep files ASCII unless existing file uses Unicode.
- Keep changes focused; avoid unrelated refactors.
- Update developer-reference docs when behavior changes.
