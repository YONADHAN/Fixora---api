"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRoutes = void 0;
const auth_middleware_1 = require("../middleware/auth_middleware");
const base_route_1 = require("./base_route");
const resolver_1 = require("../di/resolver");
class ChatRoutes extends base_route_1.BaseRoute {
    constructor() {
        super();
    }
    initializeRoutes() {
        this.router.get('/:chatId/messages', auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(['customer', 'vendor']), resolver_1.blockMyUserMiddleware.checkMyUserBlockStatus, (req, res) => {
            resolver_1.chatController.getChatMessages(req, res);
        });
        this.router.post('/initiate', auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(['customer', 'vendor']), resolver_1.blockMyUserMiddleware.checkMyUserBlockStatus, (req, res) => {
            resolver_1.chatController.initiateChat(req, res);
        });
        this.router.get('/', auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(['customer', 'vendor']), resolver_1.blockMyUserMiddleware.checkMyUserBlockStatus, (req, res) => {
            resolver_1.chatController.getUserChats(req, res);
        });
    }
}
exports.ChatRoutes = ChatRoutes;
