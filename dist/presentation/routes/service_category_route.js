"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceCategoryRoutes = void 0;
const resolver_1 = require("../di/resolver");
const auth_middleware_1 = require("../middleware/auth_middleware");
const base_route_1 = require("./base_route");
const multer_error_middleware_1 = require("../middleware/multer_error_middleware");
const multer_config_1 = require("../../interfaceAdapters/config/multer.config");
class ServiceCategoryRoutes extends base_route_1.BaseRoute {
    constructor() {
        super();
    }
    initializeRoutes() {
        this.router.use(auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(['admin']));
        /* -----------------------------
           GET ALL + CREATE
        ------------------------------ */
        this.router
            .route('/')
            .get((req, res) => resolver_1.serviceCategoryController.getAllServiceCategories(req, res))
            .post((0, multer_error_middleware_1.handleMulterError)(multer_config_1.upload.single('ServiceCategoryBannerImage')), (req, res) => resolver_1.serviceCategoryController.createServiceCategory(req, res))
            .patch((0, multer_error_middleware_1.handleMulterError)(multer_config_1.upload.single('ServiceCategoryBannerImage')), (req, res) => resolver_1.serviceCategoryController.editServiceCategory(req, res));
        /* -----------------------------
           GET SINGLE + EDIT (single ID)
        ------------------------------ */
        this.router
            .route('/:categoryId')
            .get((req, res) => resolver_1.serviceCategoryController.getSingleServiceCategory(req, res));
        /* -----------------------------
           BLOCK / UNBLOCK
        ------------------------------ */
        this.router.patch('/block', (req, res) => resolver_1.serviceCategoryController.blockServiceCategory(req, res));
    }
}
exports.ServiceCategoryRoutes = ServiceCategoryRoutes;
