# ERD and Migration-Ready Schema (v1)

This document defines the ERD (text form) and migration-ready fields.
Use UUIDs for external references and numeric IDs for internal joins.
All tables include: id (bigint PK), uuid (char(36) unique), created_at, updated_at, deleted_at.

## ERD (Text)

- Property 1..* RoomType
- Property 1..* Room
- Property 1..* RatePlan
- Property 1..* Tax
- Property 1..* Fee
- Property 1..* PaymentMethod
- Property 1..* User
- RoomType 1..* Room
- Guest 1..* Reservation (primary guest)
- Reservation 1..1 Stay
- Reservation 1..* ReservationGuest
- Reservation 1..* Folio
- Folio 1..* Charge
- Folio 1..* Payment
- Room 1..* HousekeepingTask
- Room 1..* RoomStatusLog
- ABACPolicy 1..* User (policy assignment via role or user)

## Migration Schema Details

### properties

- id bigint PK
- uuid char(36) unique
- name varchar(150)
- address text
- timezone varchar(64)
- default_currency char(3)
- default_language char(2)
- receipt_header text
- tax_id varchar(64)
- phone varchar(32)
- created_at, updated_at, deleted_at

Indexes
- unique(uuid)

### room_types

- id bigint PK
- uuid char(36) unique
- property_id bigint FK -> properties.id
- name json
- capacity tinyint
- base_rate int
- amenities_json json
- sort_order smallint
- is_active boolean
- created_at, updated_at, deleted_at

Indexes
- index(property_id)

### rooms

- id bigint PK
- uuid char(36) unique
- property_id bigint FK -> properties.id
- room_type_id bigint FK -> room_types.id
- number varchar(16)
- floor varchar(16)
- status enum('available','occupied','out_of_order')
- housekeeping_status enum('clean','dirty','inspected')
- is_active boolean
- created_at, updated_at, deleted_at

Indexes
- unique(property_id, number)
- index(room_type_id)

### rate_plans

- id bigint PK
- uuid char(36) unique
- property_id bigint FK -> properties.id
- name json
- currency char(3)
- base_rate int
- rules_json json
- cancellation_policy_json json
- created_at, updated_at, deleted_at

Indexes
- index(property_id)

### guests

- id bigint PK
- uuid char(36) unique
- name varchar(120)
- phone varchar(32)
- email varchar(120)
- id_type varchar(32)
- id_number varchar(64)
- nationality varchar(64)
- address text
- notes text
- created_at, updated_at, deleted_at

Indexes
- index(phone)
- index(id_number)

### reservations

- id bigint PK
- uuid char(36) unique
- property_id bigint FK -> properties.id
- guest_id bigint FK -> guests.id
- code varchar(32) unique
- status enum('pending','confirmed','checked_in','checked_out','canceled','no_show')
- source enum('walk_in','phone','ota','corporate')
- check_in date
- check_out date
- room_type_id bigint FK -> room_types.id
- room_id bigint FK -> rooms.id nullable
- adults tinyint
- children tinyint
- special_requests text
- created_at, updated_at, deleted_at

Indexes
- index(property_id)
- index(check_in)
- index(check_out)
- index(status)

### stays

- id bigint PK
- uuid char(36) unique
- reservation_id bigint FK -> reservations.id unique
- status enum('expected','checked_in','checked_out','no_show')
- actual_check_in datetime
- actual_check_out datetime
- assigned_room_id bigint FK -> rooms.id
- created_at, updated_at, deleted_at

Indexes
- unique(reservation_id)

### reservation_guests

- id bigint PK
- reservation_id bigint FK -> reservations.id
- guest_id bigint FK -> guests.id
- is_primary boolean

Indexes
- unique(reservation_id, guest_id)

### folios

- id bigint PK
- uuid char(36) unique
- reservation_id bigint FK -> reservations.id
- currency char(3)
- total int
- balance int
- status enum('open','closed')
- closed_at datetime
- created_at, updated_at, deleted_at

Indexes
- index(reservation_id)
- index(status)

### charges

- id bigint PK
- uuid char(36) unique
- folio_id bigint FK -> folios.id
- type varchar(32)
- amount int
- currency char(3)
- tax_amount int
- description varchar(255)
- posted_at datetime
- created_by bigint FK -> users.id
- created_at, updated_at, deleted_at

Indexes
- index(folio_id)
- index(posted_at)

### payments

- id bigint PK
- uuid char(36) unique
- folio_id bigint FK -> folios.id
- method varchar(32)
- amount int
- currency char(3)
- exchange_rate decimal(12,6)
- reference varchar(64)
- received_at datetime
- created_by bigint FK -> users.id
- created_at, updated_at, deleted_at

Indexes
- index(folio_id)
- index(received_at)

### housekeeping_tasks

- id bigint PK
- uuid char(36) unique
- room_id bigint FK -> rooms.id
- type enum('clean','inspect','maintenance')
- status enum('open','in_progress','completed')
- assigned_to bigint FK -> users.id nullable
- due_at datetime
- priority enum('low','normal','high')
- completed_at datetime
- created_at, updated_at, deleted_at

Indexes
- index(room_id)
- index(status)

### room_status_logs

- id bigint PK
- room_id bigint FK -> rooms.id
- from_status varchar(32)
- to_status varchar(32)
- changed_by bigint FK -> users.id
- changed_at datetime

Indexes
- index(room_id)
- index(changed_at)

### taxes

- id bigint PK
- property_id bigint FK -> properties.id
- name varchar(120)
- rate decimal(8,4)
- type enum('percent','flat')
- is_active boolean
- created_at, updated_at, deleted_at

Indexes
- index(property_id)

### fees

- id bigint PK
- property_id bigint FK -> properties.id
- name varchar(120)
- amount int
- type enum('percent','flat')
- is_active boolean
- created_at, updated_at, deleted_at

Indexes
- index(property_id)

### payment_methods

- id bigint PK
- property_id bigint FK -> properties.id
- name varchar(64)
- type enum('cash','card','transfer')
- is_active boolean
- created_at, updated_at, deleted_at

Indexes
- index(property_id)

### users

- id bigint PK
- uuid char(36) unique
- property_id bigint FK -> properties.id
- name varchar(120)
- email varchar(120) unique
- password varchar(255)
- role varchar(64)
- department varchar(64)
- is_active boolean
- created_at, updated_at, deleted_at

Indexes
- index(property_id)

### abac_policies

- id bigint PK
- name varchar(120)
- rules_json json
- is_active boolean
- created_at, updated_at, deleted_at

### audit_logs

- id bigint PK
- user_id bigint FK -> users.id
- action varchar(120)
- resource varchar(120)
- payload json
- ip_address varchar(64)
- user_agent varchar(255)
- created_at

Indexes
- index(user_id)
- index(created_at)

## Migration Notes

- Use foreign key constraints with ON UPDATE CASCADE.
- Use ON DELETE SET NULL for optional relationships (room_id, assigned_to).
- Use ON DELETE RESTRICT for immutable references (reservation -> property).
- Store money as integer units for MMK (no minor unit).
- Seed default roles, ABAC policies, payment methods, and room statuses.
