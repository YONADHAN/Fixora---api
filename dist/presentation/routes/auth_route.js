"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const auth_middleware_1 = require("../middleware/auth_middleware");
const base_route_1 = require("./base_route");
class AuthRoutes extends base_route_1.BaseRoute {
    constructor(authController) {
        super();
        this.authController = authController;
    }
    initializeRoutes() {
        this.router.post('/send-otp', (req, res) => {
            this.authController.sendOtpEmail(req, res);
        });
        this.router.post('/verify-otp', (req, res) => {
            this.authController.verifyOtp(req, res);
        });
        this.router.post('/signup', (req, res) => {
            this.authController.register(req, res);
        });
        this.router.post('/signin', (req, res) => {
            this.authController.login(req, res);
        });
        this.router.post('/forgot-password', (req, res) => {
            this.authController.forgotPassword(req, res);
        });
        this.router.post('/reset-password', (req, res) => {
            this.authController.resetPassword(req, res);
        });
        this.router.post('/logout', (req, res) => {
            this.authController.logout(req, res);
        });
        this.router.post('/google-auth', (req, res) => {
            this.authController.authenticateWithGoogle(req, res);
        });
        this.router.post('/change-password', auth_middleware_1.verifyAuth, (req, res) => {
            this.authController.changeMyPassword(req, res);
        });
    }
}
exports.AuthRoutes = AuthRoutes;
