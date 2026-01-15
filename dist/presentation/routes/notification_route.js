"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRoutes = void 0;
const base_route_1 = require("./base_route");
const auth_middleware_1 = require("../middleware/auth_middleware");
const resolver_1 = require("../di/resolver");
class NotificationRoutes extends base_route_1.BaseRoute {
    initializeRoutes() {
        this.router.get('/', auth_middleware_1.verifyAuth, (req, res) => resolver_1.notificationController.getMyNotifications(req, res));
        this.router.patch('/:notificationId/read', auth_middleware_1.verifyAuth, (req, res) => resolver_1.notificationController.markNotificationRead(req, res));
        this.router.patch('/read-all', auth_middleware_1.verifyAuth, (req, res) => resolver_1.notificationController.markAllNotificationsRead(req, res));
    }
}
exports.NotificationRoutes = NotificationRoutes;
