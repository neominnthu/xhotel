# API Contract Tests Plan (Postman/Newman)

This plan validates API contracts using Postman collections and Newman in CI.

## Goals

- Ensure request/response schemas match OpenAPI
- Validate error codes and edge-case behaviors
- Confirm ABAC policies are enforced

## Tooling

- Postman collections (JSON)
- Newman CLI for CI
- Optional schema validator (openapi-to-postman or prism)

## Collection Structure

- 01-auth
- 02-reservations
- 03-front-desk
- 04-folios
- 05-housekeeping
- 06-reports
- 07-admin

## Environments

- local
- staging
- production

## Data Setup

- Seed users per role
- Seed room types, rooms, rate plans
- Seed 2 active reservations (one paid, one unpaid)

## Contract Tests (Examples)

### Auth

- Login returns token and user schema
- Unauthorized access returns 401

### Reservations

- Create reservation returns code and status
- Cancel reservation with payment returns 409

### Stays

- Check-in requires available room
- Check-out requires balance zero or payment

### Folios

- Post charge returns new line item
- Post payment requires valid method

### Housekeeping

- Task update changes status

### Admin

- Create user returns id and role

## Assertions

- Status code
- JSON schema
- Error code if non-2xx
- Response time under 1000ms in staging

## CI Integration (Example)

- Run Newman on pull requests
- Fail build on schema mismatch or missing fields

## Reporting

- Store Newman HTML report as artifact
