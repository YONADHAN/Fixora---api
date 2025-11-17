"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoutes = void 0;
const auth_middleware_1 = require("../middleware/auth_middleware");
const base_route_1 = require("./base_route");
class CustomerRoutes extends base_route_1.BaseRoute {
    constructor(authController, customerController, blockMyUserMiddleware) {
        super();
        this.authController = authController;
        this.customerController = customerController;
        this.blockMyUserMiddleware = blockMyUserMiddleware;
    }
    initializeRoutes() {
        //Post Refresh Token Route
        this.router.post('/refresh-token', auth_middleware_1.decodeToken, (req, res) => {
            this.authController.handleTokenRefresh(req, res);
        });
        //  Global middlewares for all authenticated customer routes
        this.router.use(auth_middleware_1.verifyAuth, this.blockMyUserMiddleware.checkMyUserBlockStatus, (0, auth_middleware_1.authorizeRole)(['customer']));
        //  Logout
        this.router.post('/logout', (req, res) => {
            this.customerController.logout(req, res);
        });
        //  Get profile
        this.router.get('/profile-info', (req, res) => {
            this.customerController.profileInfo(req, res);
        });
        //  Update profile
        this.router.patch('/update-profile-info', (req, res) => {
            this.customerController.profileUpdate(req, res);
        });
        this.router.post('/change-password', (req, res) => {
            this.authController.changeMyPassword(req, res);
        });
    }
}
exports.CustomerRoutes = CustomerRoutes;
