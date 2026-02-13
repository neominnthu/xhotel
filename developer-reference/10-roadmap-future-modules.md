# Roadmap and Future Modules

Myanmar-first roadmap for a top-10 global-quality Hotel PMS, with clear phases and measurable outcomes.

## Phase 1.1 (0-3 months) — Core Excellence

- Front desk speed: check-in/out, room assignment, deposit posting in under 60 seconds
- Reservations stability: robust edit/cancel flows with audit trail and validation clarity
- Housekeeping workflow polish: task filters, SLA views, and faster update UX
- Reporting reliability: exports with filters, totals, and consistent formats
- Performance hygiene: audit_logs indexing, query profiling, and page load < 2s (p95)

### Acceptance Criteria

- Check-in time < 60s (p95) with keyboard-first flow
- Housekeeping board updates in < 1s (p95)
- Report export completes < 10s for 10k rows
- No critical errors in Sentry/Logs for core flows in a week

## Phase 1.2 (3-6 months) — Revenue & Distribution

- Rate plan enhancements: seasonal + special pricing rules
- Channel manager integration (OTA sync)
- Price/availability calendar with conflict prevention
- Cancellation policy automation in reservations cancel flow

### Acceptance Criteria

- Channel sync within 5 minutes, with conflict resolution
- Rate overlap prevention enforced on UI + API
- Availability view supports 30/60/90 day planning

## Phase 2 (6-12 months) — Finance & Compliance

- Full daily audit workflow with closing reports
- Multi-currency settlement and exchange rate audit
- Tax/fee rules with jurisdictional profiles
- Cashier shift reconciliation and approvals

### Acceptance Criteria

- Daily audit completes in < 10 minutes
- Cashier shift variance detected and logged
- All refunds require ABAC approval and audit entry

## Phase 3 (12+ months) — Guest Experience & Ecosystem

- Guest profile with preferences and stay history
- Self check-in kiosk mode (optional)
- Smart-lock integration
- Restaurant POS / Spa / KTV (separate modules)

### Acceptance Criteria

- Guest profile retrieval < 1s (p95)
- Smart-lock events logged and auditable
- POS and Spa modules post charges to folio reliably

## Cross-Module Requirements (All Phases)

- All modules post charges to folio
- All modules enforce ABAC policies
- All module actions generate audit logs
- Offline-tolerant UX for front desk operations

## Migration Considerations

- Data import templates for existing hotels
- Step-by-step rollout plan with rollback strategy
- Monitoring dashboards before and after integration

