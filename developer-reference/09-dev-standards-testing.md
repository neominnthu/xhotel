# Development Standards and Testing

## Coding Standards

- Laravel: PSR-12
- React: ESLint + Prettier
- Use DTOs/Form Requests for validation

## Repository Structure

- backend/ (Laravel)
- frontend/ (React)
- docs/ (product and technical specs)

## Environment Variables

- APP_ENV, APP_URL, APP_KEY
- DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD
- REDIS_HOST, REDIS_PORT
- STORAGE_DISK, STORAGE_BUCKET

## Testing

- Backend: PHPUnit + feature tests for critical flows
- Frontend: React Testing Library for forms and tables

## QA Scenarios

- Reservation create, modify, cancel
- Check-in/out with payments and refunds
- Multi-currency payment splits
- ABAC deny/allow paths

## CI Guidelines

- Lint + test on every push
- Database migrations tested on CI

## Code Review Checklist

- ABAC policy enforced on all mutating endpoints
- Audit logs added for sensitive actions
- Validation covers edge cases
- UI states for loading and empty data

## Security

- Use Laravel Sanctum for auth
- Rate limit auth and sensitive endpoints
- Encrypt sensitive guest data

