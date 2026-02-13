import Api from './Api'
import DashboardController from './DashboardController'
import FrontDesk from './FrontDesk'
import Guests from './Guests'
import Reservations from './Reservations'
import ReportsPageController from './ReportsPageController'
import Settings from './Settings'
import Folios from './Folios'
import InvoiceController from './InvoiceController'
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
Settings: Object.assign(Settings, Settings),
Folios: Object.assign(Folios, Folios),
InvoiceController: Object.assign(InvoiceController, InvoiceController),
BillingReportsController: Object.assign(BillingReportsController, BillingReportsController),
Housekeeping: Object.assign(Housekeeping, Housekeeping),
Admin: Object.assign(Admin, Admin),
}

export default Controllers