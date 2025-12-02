import { container } from 'tsyringe'
import { DependencyInjection } from './index'
import { IAuthController } from '../../domain/controllerInterfaces/users/auth-controller.interface'
import { AuthController } from '../controllers/auth/auth_controller'
import { IVendorController } from '../../domain/controllerInterfaces/users/vendor-controller.interface'
import { VendorController } from '../controllers/vendor/vendor_controller'
import { CustomerController } from '../controllers/customer/customer_controller'
import { ICustomerController } from '../../domain/controllerInterfaces/users/customer-controller.interface'
import { IAdminController } from '../../domain/controllerInterfaces/users/admin-controller.interface'
import { AdminController } from '../controllers/admin/admin_controller'
import { BlockMyUserMiddleware } from '../middleware/block_middleware'
import { IServiceCategoryController } from '../../domain/controllerInterfaces/features/service/service-category-controller.interface'
import { ServiceCategoryController } from '../controllers/service/service_category_controller'
import { ISubServiceCategoryController } from '../../domain/controllerInterfaces/features/service/sub-service-category-controller.interface'
import { SubServiceCategoryController } from '../controllers/service/sub_service_category_controller'
import { IServiceController } from '../../domain/controllerInterfaces/features/service/service-controller.interface'
import { ServiceController } from '../controllers/service/service_controller'
DependencyInjection.registerAll()

export const authController = container.resolve<IAuthController>(AuthController)
export const vendorController =
  container.resolve<IVendorController>(VendorController)
export const customerController =
  container.resolve<ICustomerController>(CustomerController)
export const adminController =
  container.resolve<IAdminController>(AdminController)
export const serviceCategoryController =
  container.resolve<IServiceCategoryController>(ServiceCategoryController)
export const subServiceCategoryController =
  container.resolve<ISubServiceCategoryController>(SubServiceCategoryController)
export const serviceController =
  container.resolve<IServiceController>(ServiceController)
//middleware
export const blockMyUserMiddleware = container.resolve(BlockMyUserMiddleware)
