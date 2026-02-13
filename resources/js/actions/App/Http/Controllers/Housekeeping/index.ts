import HousekeepingPageController from './HousekeepingPageController'
import RoomHistoryPageController from './RoomHistoryPageController'
import HousekeepingAuditPageController from './HousekeepingAuditPageController'
const Housekeeping = {
    HousekeepingPageController: Object.assign(HousekeepingPageController, HousekeepingPageController),
RoomHistoryPageController: Object.assign(RoomHistoryPageController, RoomHistoryPageController),
HousekeepingAuditPageController: Object.assign(HousekeepingAuditPageController, HousekeepingAuditPageController),
}

export default Housekeeping