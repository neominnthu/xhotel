# Newman Runbook (Optional)

This is an optional operational guide for running contract tests.

## Local Run

- newman run collections/xhotel.postman_collection.json -e env/local.json

## CI Run

- newman run collections/xhotel.postman_collection.json -e env/staging.json --reporters cli,html

## Troubleshooting

- 401 errors: check token scripts and environment variables
- 409 errors: confirm test data state
