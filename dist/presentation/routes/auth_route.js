"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const resolver_1 = require("../di/resolver");
const auth_middleware_1 = require("../middleware/auth_middleware");
const base_route_1 = require("./base_route");
class AuthRoutes extends base_route_1.BaseRoute {
    constructor() {
        super();
    }
    initializeRoutes() {
        this.router.post('/send-otp', (req, res) => {
            resolver_1.authController.sendOtpEmail(req, res);
        });
        this.router.post('/verify-otp', (req, res) => {
            resolver_1.authController.verifyOtp(req, res);
        });
        this.router.post('/signup', (req, res) => {
            resolver_1.authController.register(req, res);
        });
        this.router.post('/signin', (req, res) => {
            resolver_1.authController.login(req, res);
        });
        this.router.post('/forgot-password', (req, res) => {
            resolver_1.authController.forgotPassword(req, res);
        });
        this.router.post('/reset-password', (req, res) => {
            resolver_1.authController.resetPassword(req, res);
        });
        this.router.post('/logout', (req, res) => {
            resolver_1.authController.logout(req, res);
        });
        this.router.post('/refresh-token', (req, res) => {
            resolver_1.authController.handleTokenRefresh;
        });
        this.router.post('/google-auth', (req, res) => {
            resolver_1.authController.authenticateWithGoogle(req, res);
        });
        this.router.post('/change-password', auth_middleware_1.verifyAuth, (req, res) => {
            resolver_1.authController.changeMyPassword(req, res);
        });
    }
}
exports.AuthRoutes = AuthRoutes;
