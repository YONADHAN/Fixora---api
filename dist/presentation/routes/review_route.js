"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const resolver_1 = require("../di/resolver");
const auth_middleware_1 = require("../middleware/auth_middleware");
const base_route_1 = require("./base_route");
class ReviewRoutes extends base_route_1.BaseRoute {
    constructor() {
        super();
    }
    initializeRoutes() {
        // Public Routes
        this.router.get('/public/services/:serviceId/reviews', (req, res) => {
            resolver_1.reviewController.getServiceReviews(req, res);
        });
        // Customer Routes (Protected)
        this.router.post('/customer/reviews', auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(['customer']), (req, res) => {
            resolver_1.reviewController.createReview(req, res);
        });
        this.router.get('/customer/reviews/eligibility/:serviceId', auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(['customer']), (req, res) => {
            resolver_1.reviewController.checkEligibility(req, res);
        });
    }
}
exports.ReviewRoutes = ReviewRoutes;
