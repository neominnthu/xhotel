import AdminController from './AdminController'
import RoleController from './RoleController'
import PermissionController from './PermissionController'
const Admin = {
    AdminController: Object.assign(AdminController, AdminController),
RoleController: Object.assign(RoleController, RoleController),
PermissionController: Object.assign(PermissionController, PermissionController),
}

export default Admin