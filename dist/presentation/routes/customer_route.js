"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoutes = void 0;
const resolver_1 = require("../di/resolver");
const auth_middleware_1 = require("../middleware/auth_middleware");
const base_route_1 = require("./base_route");
const multer_error_middleware_1 = require("../middleware/multer_error_middleware");
const multer_config_1 = require("../../interfaceAdapters/config/multer.config");
const sub_service_category_route_1 = require("./sub_service_category_route");
const service_route_1 = require("./service_route");
const booking_route_1 = require("./booking_route");
const wallet_route_1 = require("./wallet_route");
const notification_route_1 = require("./notification_route");
const chat_route_1 = require("./chat_route");
const address_route_1 = require("./address_route");
const payment_route_1 = require("./payment_route");
class CustomerRoutes extends base_route_1.BaseRoute {
    constructor() {
        super();
    }
    initializeRoutes() {
        this.router.post('/refresh-token', auth_middleware_1.decodeToken, (req, res) => {
            resolver_1.authController.handleTokenRefresh(req, res);
        });
        this.router.use('/chats', new chat_route_1.ChatRoutes().router);
        this.router.use('/booking', new booking_route_1.BookingRoutes().router);
        this.router.use('/service', new service_route_1.ServiceRoutes().router);
        this.router.get('/service_category', (req, res) => {
            resolver_1.serviceCategoryController.getActiveServiceCategories(req, res);
        });
        this.router.use('/wallet', new wallet_route_1.WalletRoutes().router);
        this.router.use('/notification', new notification_route_1.NotificationRoutes().router);
        this.router.use('/payment', new payment_route_1.PaymentRoutes().router);
        this.router.use('/sub-service-category', new sub_service_category_route_1.SubServiceCategoryRoutes().router);
        this.router.use(auth_middleware_1.verifyAuth, resolver_1.blockMyUserMiddleware.checkMyUserBlockStatus, (0, auth_middleware_1.authorizeRole)(['customer']));
        this.router.use('/address', new address_route_1.AddressRoutes().router);
        this.router.post('/logout', (req, res) => {
            resolver_1.customerController.logout(req, res);
        });
        this.router.get('/profile-info', (req, res) => {
            resolver_1.customerController.profileInfo(req, res);
        });
        this.router.patch('/update-profile-info', (req, res) => {
            resolver_1.customerController.profileUpdate(req, res);
        });
        this.router.post('/change-password', (req, res) => {
            resolver_1.authController.changeMyPassword(req, res);
        });
        this.router.post('/avatar', (0, multer_error_middleware_1.handleMulterError)(multer_config_1.upload.single('profileImage')), (req, res) => {
            resolver_1.customerController.uploadProfileImage(req, res);
        });
    }
}
exports.CustomerRoutes = CustomerRoutes;
