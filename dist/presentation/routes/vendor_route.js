"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRoutes = void 0;
const resolver_1 = require("../di/resolver");
const auth_middleware_1 = require("../middleware/auth_middleware");
const base_route_1 = require("./base_route");
const multer_error_middleware_1 = require("../middleware/multer_error_middleware");
const multer_config_1 = require("../../interfaceAdapters/config/multer.config");
const sub_service_category_route_1 = require("./sub_service_category_route");
const service_route_1 = require("./service_route");
const booking_route_1 = require("./booking_route");
const wallet_route_1 = require("./wallet_route");
const chat_route_1 = require("./chat_route");
class VendorRoutes extends base_route_1.BaseRoute {
    constructor() {
        super();
    }
    initializeRoutes() {
        // Post Refresh Token Route
        this.router.post('/refresh-token', auth_middleware_1.decodeToken, (req, res) => {
            resolver_1.authController.handleTokenRefresh(req, res);
        });
        this.router.use('/chat', new chat_route_1.ChatRoutes().router);
        this.router.use('/service', new service_route_1.ServiceRoutes().router);
        this.router.use('/booking', new booking_route_1.BookingRoutes().router);
        this.router.use('/wallet', new wallet_route_1.WalletRoutes().router);
        //  Global middlewares for all authenticated vendor routes
        this.router.use(auth_middleware_1.verifyAuth, resolver_1.blockMyUserMiddleware.checkMyUserBlockStatus, (0, auth_middleware_1.authorizeRole)(['vendor']));
        this.router.use('/sub-service-category', new sub_service_category_route_1.SubServiceCategoryRoutes().router);
        //logout
        this.router.post('/logout', (req, res) => {
            resolver_1.vendorController.logout(req, res);
        });
        // Post Verification Document
        this.router.post('/upload_verification_document', (0, multer_error_middleware_1.handleMulterError)(multer_config_1.upload.array('files', 3)), (req, res) => {
            resolver_1.vendorController.uploadVerificationDocument(req, res);
        });
        // Get Profile
        this.router.get('/profile-info', (req, res) => {
            resolver_1.vendorController.profileInfo(req, res);
        });
        // Update Profile
        this.router.patch('/update-profile-info', (req, res) => {
            resolver_1.vendorController.profileUpdate(req, res);
        });
        // Upload Profile Image
        this.router.post('/avatar', (0, multer_error_middleware_1.handleMulterError)(multer_config_1.upload.single('profileImage')), (req, res) => {
            resolver_1.vendorController.uploadProfileImage(req, res);
        });
        //Get Status
        this.router.get('/status', (req, res) => {
            resolver_1.vendorController.vendorVerificationDocStatusCheck(req, res);
        });
        this.router.post('/change-password', (req, res) => {
            resolver_1.authController.changeMyPassword(req, res);
        });
    }
}
exports.VendorRoutes = VendorRoutes;
