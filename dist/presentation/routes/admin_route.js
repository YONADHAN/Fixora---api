"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const base_route_1 = require("./base_route");
const auth_middleware_1 = require("../middleware/auth_middleware");
const service_category_route_1 = require("./service_category_route");
class AdminRoutes extends base_route_1.BaseRoute {
    constructor(authController, adminController, serviceCategoryController) {
        super();
        this.authController = authController;
        this.adminController = adminController;
        this.serviceCategoryController = serviceCategoryController;
    }
    initializeRoutes() {
        this.router.post('/logout', auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(['admin']), (req, res) => {
            this.adminController.logout(req, res);
        });
        this.router.post('/refresh-token', auth_middleware_1.decodeToken, (req, res) => {
            this.authController.handleTokenRefresh(req, res);
        });
        this.router.post('/get-all-customers', auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(['admin']), (req, res) => {
            this.adminController.getAllCustomers(req, res);
        });
        this.router.post('/get-all-vendors', auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(['admin']), (req, res) => {
            this.adminController.getAllVendors(req, res);
        });
        this.router.get('/get_vendor_requests', auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(['admin']), (req, res) => this.adminController.getAllVendorRequests(req, res));
        this.router.post('/vendor-verification-status', auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(['admin']), (req, res) => this.adminController.changeMyVendorVerificationStatus(req, res));
        this.router.post('/change-my-user-block-status', auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(['admin']), (req, res) => {
            this.adminController.changeMyUserBlockStatus(req, res);
        });
        this.router.post('/change-password', (req, res) => {
            this.authController.changeMyPassword(req, res);
        });
        //service-category route
        this.router.use('/category', new service_category_route_1.ServiceCategoryRoutes(this.serviceCategoryController).router);
    }
}
exports.AdminRoutes = AdminRoutes;
