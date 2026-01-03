"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRoutes = void 0;
const resolver_1 = require("../di/resolver");
const auth_middleware_1 = require("../middleware/auth_middleware");
const base_route_1 = require("./base_route");
class BookingRoutes extends base_route_1.BaseRoute {
    constructor() {
        super();
    }
    initializeRoutes() {
        this.router.get('/slots/availability', (req, res) => resolver_1.bookingController.getAvailableSlotsForCustomer(req, res));
        this.router.post('/booking-holds', auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(['customer']), (req, res) => resolver_1.bookingController.createBookingHold(req, res));
        this.router.post('/booking-holds/:holdId/payment-intent', auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(['customer']), (req, res) => resolver_1.bookingController.createPaymentIntent(req, res));
        this.router.get('/me', auth_middleware_1.verifyAuth, auth_middleware_1.decodeToken, (0, auth_middleware_1.authorizeRole)(['customer', 'vendor', 'admin']), resolver_1.blockMyUserMiddleware.checkMyUserBlockStatus, (req, res) => resolver_1.bookingController.getMyBookings(req, res));
        this.router.get('/:bookingId', auth_middleware_1.verifyAuth, auth_middleware_1.decodeToken, (0, auth_middleware_1.authorizeRole)(['customer', 'vendor', 'admin']), resolver_1.blockMyUserMiddleware.checkMyUserBlockStatus, (req, res) => resolver_1.bookingController.getBookingDetails(req, res));
        this.router.patch('/:bookingId/cancel', auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(['customer', 'vendor', 'admin']), resolver_1.blockMyUserMiddleware.checkMyUserBlockStatus, (req, res) => resolver_1.bookingController.cancelBooking(req, res));
    }
}
exports.BookingRoutes = BookingRoutes;
