# ABAC Authorization

## Attributes

- User: role, department, shift, assigned_property
- Resource: property_id, room_id, reservation_status
- Context: time, location, operation

## Policy Storage

- Policies stored as JSON in ABACPolicy
- Loaded and evaluated in authorization middleware

## Policy JSON Structure (Example)

{
  "name": "reservation.update",
  "effect": "allow",
  "conditions": [
    {"left": "user.property_id", "op": "==", "right": "resource.property_id"},
    {"left": "resource.status", "op": "not_in", "right": ["checked_out"]}
  ]
}

## Attribute Sources

- user.* from auth token and user profile
- resource.* from database fetch
- context.* from request (time, ip, route)

## Example Rule (Pseudo)

- Allow update reservation when:
  - user.property_id == reservation.property_id
  - reservation.status not in ["checked_out"]

## Enforcement

- Every mutating API call must pass policy evaluation
- Audit log for denied actions

## Evaluation Order

- Deny overrides allow
- Explicit allow required for each action
- Missing attributes default to deny