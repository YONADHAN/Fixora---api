"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const base_route_1 = require("./base_route");
const auth_middleware_1 = require("../middleware/auth_middleware");
const resolver_1 = require("../di/resolver");
const constants_1 = require("../../shared/constants");
class PaymentRoutes extends base_route_1.BaseRoute {
    constructor() {
        super();
    }
    initializeRoutes() {
        this.router.get('/', auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)([constants_1.ROLES.CUSTOMER, constants_1.ROLES.VENDOR]), (req, res) => {
            resolver_1.paymentController.getPayments(req, res);
        });
    }
}
exports.PaymentRoutes = PaymentRoutes;
