"use strict";
// import { container } from 'tsyringe'
// import { DependencyInjection } from './index'
// import { IAuthController } from '../../domain/controllerInterfaces/users/auth-controller.interface'
// import { AuthController } from '../controllers/auth/auth_controller'
// import { IVendorController } from '../../domain/controllerInterfaces/users/vendor-controller.interface'
// import { VendorController } from '../controllers/vendor/vendor_controller'
// import { CustomerController } from '../controllers/customer/customer_controller'
// import { ICustomerController } from '../../domain/controllerInterfaces/users/customer-controller.interface'
// import { IAdminController } from '../../domain/controllerInterfaces/users/admin-controller.interface'
// import { AdminController } from '../controllers/admin/admin_controller'
// import { BlockMyUserMiddleware } from '../middleware/block_middleware'
// import { IServiceCategoryController } from '../../domain/controllerInterfaces/features/service/service-category-controller.interface'
// import { ServiceCategoryController } from '../controllers/service/service_category_controller'
Object.defineProperty(exports, "__esModule", { value: true });
// DependencyInjection.registerAll()
// export const authController = container.resolve<IAuthController>(AuthController)
// export const vendorController =
//   container.resolve<IVendorController>(VendorController)
// export const customerController =
//   container.resolve<ICustomerController>(CustomerController)
// export const adminController =
//   container.resolve<IAdminController>(AdminController)
// export const serviceCategoryController =
//   container.resolve<IServiceCategoryController>(ServiceCategoryController)
// export const blockMyUserMiddleware = container.resolve(BlockMyUserMiddleware)
const tsyringe_1 = require("tsyringe");
const index_1 = require("./index");
// Implementations
const auth_controller_1 = require("../controllers/auth/auth_controller");
const vendor_controller_1 = require("../controllers/vendor/vendor_controller");
const customer_controller_1 = require("../controllers/customer/customer_controller");
const admin_controller_1 = require("../controllers/admin/admin_controller");
const service_category_controller_1 = require("../controllers/service/service_category_controller");
// Middleware
const block_middleware_1 = require("../middleware/block_middleware");
// Register all dependencies first
index_1.DependencyInjection.registerAll();
// Only register interfaces to implementations
tsyringe_1.container.register('IAuthController', {
    useClass: auth_controller_1.AuthController,
});
tsyringe_1.container.register('IVendorController', {
    useClass: vendor_controller_1.VendorController,
});
tsyringe_1.container.register('ICustomerController', {
    useClass: customer_controller_1.CustomerController,
});
tsyringe_1.container.register('IAdminController', {
    useClass: admin_controller_1.AdminController,
});
tsyringe_1.container.register('IServiceCategoryController', {
    useClass: service_category_controller_1.ServiceCategoryController,
});
tsyringe_1.container.register('IBlockMyUserMiddleware', {
    useClass: block_middleware_1.BlockMyUserMiddleware,
});
