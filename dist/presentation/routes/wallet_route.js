"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRoutes = void 0;
const base_route_1 = require("./base_route");
const auth_middleware_1 = require("../middleware/auth_middleware");
const resolver_1 = require("../di/resolver");
class WalletRoutes extends base_route_1.BaseRoute {
    constructor() {
        super();
    }
    initializeRoutes() {
        this.router.get('/', auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(['customer', 'vendor']), (req, res) => resolver_1.walletController.getMyWallet(req, res));
    }
}
exports.WalletRoutes = WalletRoutes;
