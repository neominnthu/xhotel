# Component API (Props and States)

This document defines standard component props and states for the React UI.

## AppShell

Props
- user
- navigationItems
- onNavigate(path)
- onLogout()

States
- sidebarCollapsed

## PageHeader

Props
- title
- subtitle (optional)
- actions (buttons array)
- breadcrumbs (optional)

## StatCard

Props
- label
- value
- delta (optional)
- tone (neutral|positive|negative)

## FilterBar

Props
- filters (schema array)
- values
- onChange(values)
- onReset()

## DataTable

Props
- columns (key, label, render)
- data
- loading
- emptyState
- rowActions
- onRowClick
- pagination (page, perPage, total)
- onPageChange

States
- loading
- empty

## StatusBadge

Props
- status
- tone (auto by status)

## Modal

Props
- title
- open
- onClose
- footerActions

## Drawer

Props
- title
- open
- onClose
- width (sm|md|lg)

## FormInput

Props
- label
- value
- onChange
- error
- placeholder
- required
- type (text|email|password|number)

## FormSelect

Props
- label
- value
- options (label, value)
- onChange
- error
- required

## FormDate

Props
- label
- value
- onChange
- min
- max
- error
- required

## FormTextarea

Props
- label
- value
- onChange
- rows
- error

## EmptyState

Props
- title
- description
- action (optional)

## LoadingSkeleton

Props
- rows
- variant (table|card|form)

## Toast

Props
- message
- tone (success|info|warning|error)
- duration

## ChartLine

Props
- data
- xKey
- yKey
- color

## ChartBar

Props
- data
- xKey
- yKey
- color

## RoomCard

Props
- number
- roomType
- status
- housekeepingStatus
- onClick

## KanbanBoard

Props
- columns (id, title)
- items
- onMove(itemId, columnId)

## TaskCard

Props
- title
- roomNumber
- status
- priority
- onAssign
- onComplete

## PaymentForm

Props
- amount
- currency
- method
- onChange
- onSubmit
- validationErrors

States
- submitting

## RoomAvailabilityTable

Props
- rooms
- onSelectRoom
- selectedRoomId

## SummaryCard

Props
- title
- items (label, value)

## Tabs

Props
- tabs (id, label)
- activeTab
- onChange

## JsonEditor

Props
- value
- onChange
- readOnly
- error
