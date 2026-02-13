import AuthController from './AuthController'
import AvailabilityController from './AvailabilityController'
import AvailabilityHoldController from './AvailabilityHoldController'
import DashboardController from './DashboardController'
import ReservationController from './ReservationController'
import ReservationImportController from './ReservationImportController'
import GuestController from './GuestController'
import CancellationPolicyController from './CancellationPolicyController'
import StayController from './StayController'
import FolioController from './FolioController'
import RefundController from './RefundController'
import RoomStatusLogController from './RoomStatusLogController'
import HousekeepingTaskController from './HousekeepingTaskController'
import HousekeepingPerformanceController from './HousekeepingPerformanceController'
import FrontDeskController from './FrontDeskController'
import ReportsController from './ReportsController'
import SystemUpdateController from './SystemUpdateController'
import SystemBackupController from './SystemBackupController'
import SystemReportController from './SystemReportController'
const Api = {
    AuthController: Object.assign(AuthController, AuthController),
AvailabilityController: Object.assign(AvailabilityController, AvailabilityController),
AvailabilityHoldController: Object.assign(AvailabilityHoldController, AvailabilityHoldController),
DashboardController: Object.assign(DashboardController, DashboardController),
ReservationController: Object.assign(ReservationController, ReservationController),
ReservationImportController: Object.assign(ReservationImportController, ReservationImportController),
GuestController: Object.assign(GuestController, GuestController),
CancellationPolicyController: Object.assign(CancellationPolicyController, CancellationPolicyController),
StayController: Object.assign(StayController, StayController),
FolioController: Object.assign(FolioController, FolioController),
RefundController: Object.assign(RefundController, RefundController),
RoomStatusLogController: Object.assign(RoomStatusLogController, RoomStatusLogController),
HousekeepingTaskController: Object.assign(HousekeepingTaskController, HousekeepingTaskController),
HousekeepingPerformanceController: Object.assign(HousekeepingPerformanceController, HousekeepingPerformanceController),
FrontDeskController: Object.assign(FrontDeskController, FrontDeskController),
ReportsController: Object.assign(ReportsController, ReportsController),
SystemUpdateController: Object.assign(SystemUpdateController, SystemUpdateController),
SystemBackupController: Object.assign(SystemBackupController, SystemBackupController),
SystemReportController: Object.assign(SystemReportController, SystemReportController),
}

export default Api