"use strict";
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
//routes
const auth_route_1 = require("../routes/auth_route");
const vendor_route_1 = require("../routes/vendor_route");
const customer_route_1 = require("../routes/customer_route");
const admin_route_1 = require("../routes/admin_route");
const resolver_1 = require("../di/resolver");
class ExpressServer {
    constructor() {
        this._app = (0, express_1.default)();
        this.configureMiddlewares();
        this.configureRoutes();
    }
    configureMiddlewares() {
        this._app.use((0, helmet_1.default)());
        this._app.use((0, express_rate_limit_1.default)({
            windowMs: 15 * 60 * 1000,
            max: 1000,
        }));
        this._app.use((0, cors_1.default)({
            origin: config_1.config.cors.FRONTEND_URL,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            credentials: true,
        }));
        this._app.post('/api/v1/webhooks/stripe', express_1.default.raw({ type: 'application/json' }), (req, res) => resolver_1.stripeWebhookController.handle(req, res));
        this._app.use(express_1.default.json());
        this._app.use(express_1.default.urlencoded({ extended: true }));
        this._app.use((0, cookie_parser_1.default)());
        const logsDir = path_1.default.join(__dirname, '../../../shared/utils/logs');
        if (!fs_1.default.existsSync(logsDir)) {
            fs_1.default.mkdirSync(logsDir, { recursive: true });
        }
        const logStream = fs_1.default.createWriteStream(path_1.default.join(logsDir, 'access.log'), {
            flags: 'a',
        });
        this._app.use((0, morgan_1.default)('dev'));
        this._app.use((0, morgan_1.default)('combined', { stream: logStream }));
    }
    configureRoutes() {
        this._app.use('/api/v1/auth', new auth_route_1.AuthRoutes().router);
        this._app.use('/api/v1/admin', new admin_route_1.AdminRoutes().router);
        this._app.use('/api/v1/vendor', new vendor_route_1.VendorRoutes().router);
        this._app.use('/api/v1/customer', new customer_route_1.CustomerRoutes().router);
    }
    getApp() {
        return this._app;
    }
}
exports.ExpressServer = ExpressServer;
