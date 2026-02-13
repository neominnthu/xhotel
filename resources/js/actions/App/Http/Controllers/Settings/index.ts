import CancellationPolicyPageController from './CancellationPolicyPageController'
import UpdatePageController from './UpdatePageController'
import AuditLogPageController from './AuditLogPageController'
import RoomTypePageController from './RoomTypePageController'
import RatePageController from './RatePageController'
import ProfileController from './ProfileController'
import PasswordController from './PasswordController'
import TwoFactorAuthenticationController from './TwoFactorAuthenticationController'
const Settings = {
    CancellationPolicyPageController: Object.assign(CancellationPolicyPageController, CancellationPolicyPageController),
UpdatePageController: Object.assign(UpdatePageController, UpdatePageController),
AuditLogPageController: Object.assign(AuditLogPageController, AuditLogPageController),
RoomTypePageController: Object.assign(RoomTypePageController, RoomTypePageController),
RatePageController: Object.assign(RatePageController, RatePageController),
ProfileController: Object.assign(ProfileController, ProfileController),
PasswordController: Object.assign(PasswordController, PasswordController),
TwoFactorAuthenticationController: Object.assign(TwoFactorAuthenticationController, TwoFactorAuthenticationController),
}

export default Settings