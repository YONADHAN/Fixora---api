"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubServiceCategoryRoutes = void 0;
const base_route_1 = require("./base_route");
const multer_config_1 = require("../../interfaceAdapters/config/multer.config");
const multer_error_middleware_1 = require("../middleware/multer_error_middleware");
const auth_middleware_1 = require("../middleware/auth_middleware");
const resolver_1 = require("../di/resolver");
const resolver_2 = require("../di/resolver");
class SubServiceCategoryRoutes extends base_route_1.BaseRoute {
    constructor() {
        super();
    }
    initializeRoutes() {
        this.router
            .route('/')
            .post(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(['admin', 'vendor']), (0, multer_error_middleware_1.handleMulterError)(multer_config_1.upload.single('SubServiceCategoryImage')), resolver_2.blockMyUserMiddleware.checkMyUserBlockStatus, (req, res) => resolver_1.subServiceCategoryController.createSubServiceCategories(req, res))
            .get((req, res) => resolver_1.subServiceCategoryController.getAllSubServiceCategories(req, res))
            .patch(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(['admin', 'vendor']), resolver_2.blockMyUserMiddleware.checkMyUserBlockStatus, (0, multer_error_middleware_1.handleMulterError)(multer_config_1.upload.single('SubServiceCategoryImage')), (req, res) => resolver_1.subServiceCategoryController.editSubServiceCategory(req, res));
        this.router
            .route('/vendor-created')
            .get(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(['vendor']), (req, res) => {
            resolver_1.subServiceCategoryController.getVendorSubServiceCategories(req, res);
        });
        this.router.patch('/verification/:subServiceCategoryId', auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(['admin']), (req, res) => {
            resolver_1.subServiceCategoryController.toggleVerificationStatusOfSubServiceCategory(req, res);
        });
        this.router.get('/search/sub-service-categories', (req, res) => {
            resolver_1.subServiceCategoryController.getAllSubServiceCategoriesBasedOnServiceCategoryId(req, res);
        });
        this.router.get('/active', (req, res) => {
            resolver_1.subServiceCategoryController.getActiveSubServiceCategories(req, res);
        });
        this.router
            .route('/:subServiceCategoryId')
            .get((req, res) => resolver_1.subServiceCategoryController.getSingleSubServiceCategory(req, res))
            .patch(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(['admin']), (req, res) => resolver_1.subServiceCategoryController.toggleBlockStatusOfSubServiceCategory(req, res));
    }
}
exports.SubServiceCategoryRoutes = SubServiceCategoryRoutes;
