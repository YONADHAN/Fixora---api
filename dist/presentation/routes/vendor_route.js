"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRoutes = void 0;
const resolver_1 = require("../di/resolver");
const auth_middleware_1 = require("../middleware/auth_middleware");
const base_route_1 = require("./base_route");
const multer_error_middleware_1 = require("../middleware/multer_error_middleware");
const multer_config_1 = require("../../interfaceAdapters/config/multer.config");
class VendorRoutes extends base_route_1.BaseRoute {
    constructor() {
        super();
    }
    initializeRoutes() {
        // Post Refresh Token Route
        this.router.post('/refresh-token', auth_middleware_1.decodeToken, (req, res) => {
            resolver_1.authController.handleTokenRefresh(req, res);
        });
        //  Global middlewares for all authenticated vendor routes
        this.router.use(auth_middleware_1.verifyAuth, resolver_1.blockMyUserMiddleware.checkMyUserBlockStatus, (0, auth_middleware_1.authorizeRole)(['vendor']));
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
