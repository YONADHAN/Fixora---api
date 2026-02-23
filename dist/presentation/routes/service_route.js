"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceRoutes = void 0;
const base_route_1 = require("./base_route");
const multer_config_1 = require("../../interfaceAdapters/config/multer.config");
const multer_error_middleware_1 = require("../middleware/multer_error_middleware");
const auth_middleware_1 = require("../middleware/auth_middleware");
const resolver_1 = require("../di/resolver");
const resolver_2 = require("../di/resolver");
class ServiceRoutes extends base_route_1.BaseRoute {
    constructor() {
        super();
    }
    initializeRoutes() {
        this.router.post('/', auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(['vendor']), resolver_2.blockMyUserMiddleware.checkMyUserBlockStatus, (0, multer_error_middleware_1.handleMulterError)(multer_config_1.upload.array('images', 1)), (req, res) => resolver_1.serviceController.createService(req, res));
        this.router.get('/', auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(['vendor']), (req, res) => resolver_1.serviceController.getAllServices(req, res));
        this.router.get('/search_services', (req, res) => resolver_1.serviceController.searchServicesForCustomer(req, res));
        this.router.get('/:serviceId', (req, res) => resolver_1.serviceController.getServiceById(req, res));
        this.router.patch('/:serviceId/edit', auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(['vendor']), resolver_2.blockMyUserMiddleware.checkMyUserBlockStatus, (0, multer_error_middleware_1.handleMulterError)(multer_config_1.upload.array('images', 1)), (req, res) => resolver_1.serviceController.editService(req, res));
        this.router.patch('/:serviceId/toggleblock', auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(['vendor']), resolver_2.blockMyUserMiddleware.checkMyUserBlockStatus, (req, res) => resolver_1.serviceController.toggleServiceBlock(req, res));
    }
}
exports.ServiceRoutes = ServiceRoutes;
