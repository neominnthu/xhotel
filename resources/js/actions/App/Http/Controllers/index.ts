import Api from './Api'
import DashboardController from './DashboardController'
import FrontDesk from './FrontDesk'
import Guests from './Guests'
import Reservations from './Reservations'
import ReportsPageController from './ReportsPageController'
import NightAuditPageController from './NightAuditPageController'
import CashierShiftPageController from './CashierShiftPageController'
import Settings from './Settings'
import RoomInventoryPageController from './RoomInventoryPageController'
import Folios from './Folios'
import InvoiceController from './InvoiceController'
import RefundReceiptController from './RefundReceiptController'
import BillingReportsController from './BillingReportsController'
import Housekeeping from './Housekeeping'
import Admin from './Admin'
const Controllers = {
    Api: Object.assign(Api, Api),
DashboardController: Object.assign(DashboardController, DashboardController),
FrontDesk: Object.assign(FrontDesk, FrontDesk),
Guests: Object.assign(Guests, Guests),
Reservations: Object.assign(Reservations, Reservations),
ReportsPageController: Object.assign(ReportsPageController, ReportsPageController),
NightAuditPageController: Object.assign(NightAuditPageController, NightAuditPageController),
CashierShiftPageController: Object.assign(CashierShiftPageController, CashierShiftPageController),
Settings: Object.assign(Settings, Settings),
RoomInventoryPageController: Object.assign(RoomInventoryPageController, RoomInventoryPageController),
Folios: Object.assign(Folios, Folios),
InvoiceController: Object.assign(InvoiceController, InvoiceController),
RefundReceiptController: Object.assign(RefundReceiptController, RefundReceiptController),
BillingReportsController: Object.assign(BillingReportsController, BillingReportsController),
Housekeeping: Object.assign(Housekeeping, Housekeeping),
Admin: Object.assign(Admin, Admin),
}

export default Controllers