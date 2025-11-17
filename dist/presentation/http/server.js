"use strict";
// import { Application } from 'express'
// import helmet from 'helmet'
// import express from 'express'
// import rateLimit from 'express-rate-limit'
// import { config } from '../../shared/config'
// import cors from 'cors'
// import cookieParser from 'cookie-parser'
// import morgan from 'morgan'
// import fs from 'fs'
// import path from 'path'
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressServer = void 0;
const helmet_1 = __importDefault(require("helmet"));
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const config_1 = require("../../shared/config");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const tsyringe_1 = require("tsyringe");
// Routes
const auth_route_1 = require("../routes/auth_route");
const vendor_route_1 = require("../routes/vendor_route");
const customer_route_1 = require("../routes/customer_route");
const admin_route_1 = require("../routes/admin_route");
class ExpressServer {
    constructor() {
        this._app = (0, express_1.default)();
        this.configureMiddlewares();
        this.configureRoutes();
    }
    configureMiddlewares() {
        this._app.use((0, helmet_1.default)());
        this._app.use((0, express_rate_limit_1.default)({ windowMs: 15 * 60 * 1000, max: 1000 }));
        this._app.use((0, cors_1.default)({
            origin: config_1.config.cors.FRONTEND_URL,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            credentials: true,
        }));
        this._app.use(express_1.default.json());
        this._app.use(express_1.default.urlencoded({ extended: true }));
        this._app.use((0, cookie_parser_1.default)());
        const logsDir = path_1.default.join(__dirname, '../../../shared/utils/logs');
        if (!fs_1.default.existsSync(logsDir))
            fs_1.default.mkdirSync(logsDir, { recursive: true });
        const logStream = fs_1.default.createWriteStream(path_1.default.join(logsDir, 'access.log'), {
            flags: 'a',
        });
        this._app.use((0, morgan_1.default)('dev'));
        this._app.use((0, morgan_1.default)('combined', { stream: logStream }));
    }
    configureRoutes() {
        // Resolve everything ONCE — no circular imports
        const authController = tsyringe_1.container.resolve('IAuthController');
        const adminController = tsyringe_1.container.resolve('IAdminController');
        const vendorController = tsyringe_1.container.resolve('IVendorController');
        const customerController = tsyringe_1.container.resolve('ICustomerController');
        const serviceCategoryController = tsyringe_1.container.resolve('IServiceCategoryController');
        const blockMyUserMiddleware = tsyringe_1.container.resolve('IBlockMyUserMiddleware');
        // Attach routes
        this._app.use('/api/v1/auth', new auth_route_1.AuthRoutes(authController).router);
        this._app.use('/api/v1/admin', new admin_route_1.AdminRoutes(authController, adminController, serviceCategoryController).router);
        this._app.use('/api/v1/vendor', new vendor_route_1.VendorRoutes(authController, vendorController, blockMyUserMiddleware)
            .router);
        this._app.use('/api/v1/customer', new customer_route_1.CustomerRoutes(authController, customerController, blockMyUserMiddleware).router);
    }
    getApp() {
        return this._app;
    }
}
exports.ExpressServer = ExpressServer;
