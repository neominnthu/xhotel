# Component API with Event Payload Examples

This document extends component APIs with event payloads.

## AppShell

Events
- onNavigate(path) -> { path: "/reservations" }
- onLogout() -> { confirmed: true }

## FilterBar

Events
- onChange(values) -> { status: "confirmed", dateRange: ["2026-02-14", "2026-02-16"] }
- onReset() -> {}

## DataTable

Events
- onRowClick(row) -> { id: 1201, code: "RSV-20260214-001" }
- onPageChange(page) -> { page: 2, perPage: 20 }

## Modal

Events
- onClose() -> { reason: "backdrop" | "escape" | "action" }

## Drawer

Events
- onClose() -> { reason: "backdrop" | "escape" | "action" }

## FormInput

Events
- onChange(value) -> { value: "Aye Aye" }

## FormSelect

Events
- onChange(value) -> { value: "walk_in" }

## FormDate

Events
- onChange(value) -> { value: "2026-02-14" }

## Tabs

Events
- onChange(tabId) -> { tabId: "folio" }

## RoomAvailabilityTable

Events
- onSelectRoom(roomId) -> { roomId: 101 }

## PaymentForm

Events
- onChange(values) -> { method: "cash", amount: 50000, currency: "MMK" }
- onSubmit(values) -> { method: "cash", amount: 50000, currency: "MMK" }

## KanbanBoard

Events
- onMove(itemId, columnId) -> { itemId: 5001, columnId: "in_progress" }

## TaskCard

Events
- onAssign(userId) -> { taskId: 5001, userId: 12 }
- onComplete() -> { taskId: 5001 }

## Toast

Events
- onDismiss() -> { reason: "timeout" | "manual" }

## ChartLine

Events
- onPointClick(point) -> { x: "2026-02-14", y: 0.78 }

## ChartBar

Events
- onBarClick(bar) -> { label: "OTA", value: 320000 }
