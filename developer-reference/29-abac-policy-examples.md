# ABAC Policy JSON Examples per Role

These are sample policies in JSON for each role. They are examples and must be reviewed.

## Front Desk

{
  "name": "front_desk.reservation.update",
  "effect": "allow",
  "conditions": [
    {"left": "user.role", "op": "==", "right": "front_desk"},
    {"left": "user.property_id", "op": "==", "right": "resource.property_id"},
    {"left": "resource.status", "op": "not_in", "right": ["checked_out"]}
  ]
}

## Reservation Manager

{
  "name": "reservation_manager.reservation.manage",
  "effect": "allow",
  "conditions": [
    {"left": "user.role", "op": "==", "right": "reservation_manager"},
    {"left": "user.property_id", "op": "==", "right": "resource.property_id"}
  ]
}

## Housekeeping

{
  "name": "housekeeping.room.update_status",
  "effect": "allow",
  "conditions": [
    {"left": "user.role", "op": "==", "right": "housekeeping"},
    {"left": "user.property_id", "op": "==", "right": "resource.property_id"},
    {"left": "resource.status", "op": "!=", "right": "out_of_order"}
  ]
}

## Cashier

{
  "name": "cashier.folio.payment",
  "effect": "allow",
  "conditions": [
    {"left": "user.role", "op": "==", "right": "cashier"},
    {"left": "user.property_id", "op": "==", "right": "resource.property_id"},
    {"left": "resource.status", "op": "==", "right": "open"}
  ]
}

## Admin

{
  "name": "admin.full_access",
  "effect": "allow",
  "conditions": [
    {"left": "user.role", "op": "==", "right": "admin"}
  ]
}
