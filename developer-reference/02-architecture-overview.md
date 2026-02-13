# Architecture Overview

## Stack

- Backend: Laravel (REST API)
- Frontend: React SPA
- Database: MySQL 8
- Cache/Queue: Redis
- Storage: S3-compatible

## Deployment Model

- Single-tenant per deployment
- One property per installation

## Logical Layers

- API layer: controllers, request validation, response shaping
- Domain layer: services, business rules, policies
- Data layer: repositories, Eloquent models, migrations
- Integration layer: payments, SMS/Email, OTA/Channel manager

## Data Flow (Typical Reservation)

- React form submits reservation payload
- API validates input and checks ABAC policy
- Domain service creates reservation, stay, and folio
- Events trigger notifications and availability updates

## Reliability and Performance

- Use Redis for fast availability and pricing lookups
- Queue all slow tasks (emails, PDF invoices, external sync)
- Apply optimistic locking for folio edits

## High-Level Components

- Auth and User Management
- Reservation Service
- Front Desk Service
- Billing and Folio Service
- Housekeeping Service
- Reporting Service

## Cross-Cutting Concerns

- ABAC authorization middleware
- Audit logging for sensitive actions
- Locale and currency conversion
- Error and performance monitoring

## Security

- Laravel Sanctum for API authentication
- Password policy and session limits
- Rate limiting for auth and public endpoints
- Encryption for sensitive guest data fields

## Observability

- Structured logs with correlation IDs
- Metrics for reservation latency and queue throughput
- Daily error digest for admins

## Update & Recovery (Planned)

- Production updates run as background jobs with a maintenance gate and health checks.
- Pre-update database backup is mandatory; backup metadata stored for audit.
- Rollback can restore code and database to last known good snapshot.
- Update status events are logged and visible to admins.
- GitHub integration is used for release packages and error/bug reporting.

## Integration Points (v1-ready)

- Payment gateway
- SMS/Email notifications
- Optional channel manager

