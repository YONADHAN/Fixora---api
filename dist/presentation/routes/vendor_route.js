"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRoutes = void 0;
const auth_middleware_1 = require("../middleware/auth_middleware");
const base_route_1 = require("./base_route");
const multer_error_middleware_1 = require("../middleware/multer_error_middleware");
const multer_config_1 = require("../../interfaceAdapters/config/multer.config");
class VendorRoutes extends base_route_1.BaseRoute {
    constructor(authController, vendorController, blockMyUserMiddleware) {
        super();
        this.authController = authController;
        this.vendorController = vendorController;
        this.blockMyUserMiddleware = blockMyUserMiddleware;
    }
    initializeRoutes() {
        // Post Refresh Token Route
        this.router.post('/refresh-token', auth_middleware_1.decodeToken, (req, res) => {
            this.authController.handleTokenRefresh(req, res);
        });
        //  Global middlewares for all authenticated vendor routes
        this.router.use(auth_middleware_1.verifyAuth, this.blockMyUserMiddleware.checkMyUserBlockStatus, (0, auth_middleware_1.authorizeRole)(['vendor']));
        //logout
        this.router.post('/logout', (req, res) => {
            this.vendorController.logout(req, res);
        });
        // Post Verification Document
        this.router.post('/upload_verification_document', (0, multer_error_middleware_1.handleMulterError)(multer_config_1.upload.array('files', 3)), (req, res) => {
            this.vendorController.uploadVerificationDocument(req, res);
        });
        // Get Profile
        this.router.get('/profile-info', (req, res) => {
            this.vendorController.profileInfo(req, res);
        });
        // Update Profile
        this.router.patch('/update-profile-info', (req, res) => {
            this.vendorController.profileUpdate(req, res);
        });
        //Get Status
        this.router.get('/status', (req, res) => {
            this.vendorController.vendorVerificationDocStatusCheck(req, res);
        });
        this.router.post('/change-password', (req, res) => {
            this.authController.changeMyPassword(req, res);
        });
    }
}
exports.VendorRoutes = VendorRoutes;
