# Localization and Currency

## Language

- Default language: Myanmar
- Secondary language: English
- All UI strings stored in i18n JSON files

## Fallback Rules

- If translation is missing in Myanmar, fallback to English.
- If English is missing, fallback to key name.

## Localized Fields

- Names for rate plans, room types can be stored as JSON
- Example: {"my":"Deluxe","en":"Deluxe"}

## Date and Number Formats

- Dates stored as ISO 8601 (UTC)
- Display uses property timezone and locale settings
- Numeric formatting uses locale separators

## Currency

- Property default currency is base currency
- Charges and payments store original currency
- Exchange rate recorded at transaction time

## Rounding Rules

- Store monetary values as integer cents where possible
- If currency has no minor unit, use integer units
- Round totals using configured unit and method from config/billing.php

