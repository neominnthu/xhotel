import FrontDeskPageController from './FrontDeskPageController'
import CheckInPageController from './CheckInPageController'
import CheckOutPageController from './CheckOutPageController'
const FrontDesk = {
    FrontDeskPageController: Object.assign(FrontDeskPageController, FrontDeskPageController),
CheckInPageController: Object.assign(CheckInPageController, CheckInPageController),
CheckOutPageController: Object.assign(CheckOutPageController, CheckOutPageController),
}

export default FrontDesk