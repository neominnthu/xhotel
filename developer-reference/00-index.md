# XHotel PMS Developer Reference

This folder is the single source of truth for product scope, architecture, and build standards.

## Documents

- 01-product-vision.md
- 02-architecture-overview.md
- 03-domain-modules.md
- 04-data-model.md
- 05-api-guidelines.md
- 06-abac-authorization.md
- 07-localization-currency.md
- 08-frontend-design-system.md
- 09-dev-standards-testing.md
- 10-roadmap-future-modules.md
- 11-api-endpoint-specs.md
- 12-erd-schema.md
- 13-ui-wire-spec.md
- 14-openapi.yaml
- 15-validation-rules.md
- 16-error-codes.md
- 17-component-api.md
- 18-acceptance-criteria.md
- 19-layout-grids.md
- 20-role-based-acceptance.md
- 21-endpoint-edge-cases.md
- 22-component-events.md
- 24-abac-role-matrix.md
- 25-api-contract-tests.md
- 26-keyboard-workflows.md
- 28-postman-collections.md
- 29-abac-policy-examples.md
- 30-keyboard-conflicts-i18n.md
- 31-postman-collection.json
- 32-postman-environment.json
- 33-abac-policy-tests.md
- 34-keyboard-focus-order.md
- 35-test-data-seed-plan.md
- 36-shortcut-help-i18n.json
- 37-audit-metrics-events.md
- 38-update-workflow-spec.md

## Conventions

- All times are stored in UTC; display in property timezone.
- Default language is Myanmar; English is secondary.
- Base currency is property default; transactions keep original currency.
- Single-tenant deployment (one property per deployment).
- Use soft deletes for core entities where operational history matters.
- Audit all sensitive actions (auth, pricing, folio changes, refunds).
- IDs are UUIDs for external references, numeric for internal tables.
- Status fields are explicit enums, never inferred from dates alone.
