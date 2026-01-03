"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubServiceCategoryController = void 0;
const tsyringe_1 = require("tsyringe");
const error_handler_1 = require("../../../shared/utils/error_handler");
const constants_1 = require("../../../shared/constants");
const create_sub_service_category_schema_1 = require("../../validations/sub_service_category/create_sub_service_category.schema");
const create_sub_service_category_mapper_1 = require("../../../application/mappers/sub_service_category/create_sub_service_category_mapper");
const get_all_sub_service_category_schema_1 = require("../../validations/sub_service_category/get_all_sub_service_category.schema");
const get_all_sub_service_category_mapper_1 = require("../../../application/mappers/sub_service_category/get_all_sub_service_category_mapper");
const edit_sub_service_category_schema_1 = require("../../validations/sub_service_category/edit_sub_service_category.schema");
const edit_sub_service_category_mapper_1 = require("../../../application/mappers/sub_service_category/edit_sub_service_category_mapper");
const get_single_sub_service_category_schema_1 = require("../../validations/sub_service_category/get_single_sub_service_category.schema");
const get_single_sub_service_category_mapper_1 = require("../../../application/mappers/sub_service_category/get_single_sub_service_category_mapper");
const toggle_block_status_of_sub_service_category_schema_1 = require("../../validations/sub_service_category/toggle_block_status_of_sub_service_category.schema");
const toggle_block_status_of_sub_service_category_mapper_1 = require("../../../application/mappers/sub_service_category/toggle_block_status_of_sub_service_category_mapper");
const toggle_verification_status_of_sub_service_category_schema_1 = require("../../validations/sub_service_category/toggle_verification_status_of_sub_service_category.schema");
const toggle_verification_status_of_sub_service_category_mapper_1 = require("../../../application/mappers/sub_service_category/toggle_verification_status_of_sub_service_category_mapper");
const get_vendor_sub_service_category_schema_1 = require("../../validations/sub_service_category/get_vendor_sub_service_category.schema");
const get_vendor_sub_service_category_mapper_1 = require("../../../application/mappers/sub_service_category/get_vendor_sub_service_category_mapper");
const get_sub_service_categories_based_on_service_category_id_schema_1 = require("../../validations/sub_service_category/get_sub_service_categories_based_on_service_category_id.schema");
const get_sub_service_catergories_based_on_service_category_mapper_1 = require("../../../application/mappers/sub_service_category/get_sub_service_catergories_based_on_service_category_mapper");
let SubServiceCategoryController = class SubServiceCategoryController {
    constructor(_createSubServiceCategoryUseCase, _getAllSubServiceCategoriesUseCase, _editSubServiceCategoryUseCase, _getSingleSubServiceCategoryUseCase, _toggleBlockStatusOfSubServiceCategoryUseCase, _toggleVerificationStatusOfSubServiceCategoryUseCase, _getVendorSubServiceCategoriesUseCase, _getAllSubServiceCategoriesBasedOnServiceCategoryIdUseCase, _getActiveSubServiceCategoriesUseCase) {
        this._createSubServiceCategoryUseCase = _createSubServiceCategoryUseCase;
        this._getAllSubServiceCategoriesUseCase = _getAllSubServiceCategoriesUseCase;
        this._editSubServiceCategoryUseCase = _editSubServiceCategoryUseCase;
        this._getSingleSubServiceCategoryUseCase = _getSingleSubServiceCategoryUseCase;
        this._toggleBlockStatusOfSubServiceCategoryUseCase = _toggleBlockStatusOfSubServiceCategoryUseCase;
        this._toggleVerificationStatusOfSubServiceCategoryUseCase = _toggleVerificationStatusOfSubServiceCategoryUseCase;
        this._getVendorSubServiceCategoriesUseCase = _getVendorSubServiceCategoriesUseCase;
        this._getAllSubServiceCategoriesBasedOnServiceCategoryIdUseCase = _getAllSubServiceCategoriesBasedOnServiceCategoryIdUseCase;
        this._getActiveSubServiceCategoriesUseCase = _getActiveSubServiceCategoriesUseCase;
    }
    createSubServiceCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                //console.log('Entering into the creat sub servic categoriy controller')
                const validated = create_sub_service_category_schema_1.createSubServiceCategoryZodValidationSchema.parse({
                    body: req.body,
                    file: req.file,
                });
                //console.log('The data validated is :', validated)
                const createdById = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) !== null && _b !== void 0 ? _b : '';
                const createdByRole = (_d = (_c = req.user) === null || _c === void 0 ? void 0 : _c.role) !== null && _d !== void 0 ? _d : '';
                const isActive = 'active';
                const dto = create_sub_service_category_mapper_1.CreateSubServiceCategoryRequestMapper.toDTO({
                    body: validated.body,
                    file: validated.file,
                    createdById,
                    createdByRole,
                    isActive,
                });
                //console.log('The dto enters into the use case is :', dto)
                const response = yield this._createSubServiceCategoryUseCase.execute(dto);
                res.status(constants_1.HTTP_STATUS.CREATED).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.CREATED_SUB_SERVICE_CATEGORY,
                    data: response,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    getAllSubServiceCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validated = get_all_sub_service_category_schema_1.getAllSubServiceCategoriesZodValidationSchema.parse(req.query);
                const dto = get_all_sub_service_category_mapper_1.GetAllSubServiceCategoriesRequestMapper.toDTO({
                    page: validated.page,
                    limit: validated.limit,
                    search: validated.search || '',
                });
                const response = yield this._getAllSubServiceCategoriesUseCase.execute(dto);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.SUB_SERVICE_CATEGORIES_FOUND_SUCCESSFULLY,
                    data: response,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    editSubServiceCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //console.log('Entered')
                //console.log('body', req.body)
                //if (req.file) {
                //  console.log('file got ')
                //}
                const validated = edit_sub_service_category_schema_1.editSubServiceCategoryZodValidationSchema.parse({
                    body: req.body,
                    file: req.file,
                });
                // console.log('validated', validated)
                const dto = edit_sub_service_category_mapper_1.EditSubServiceCategoryRequestMapper.toDTO({
                    body: validated.body,
                    file: validated.file,
                });
                //console.log('dto', dto)
                const response = yield this._editSubServiceCategoryUseCase.execute(dto);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.EDITED_SUB_SERVICE_CATEGORY,
                    data: response,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    getSingleSubServiceCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log('entered')
                const validated = get_single_sub_service_category_schema_1.GetSingleSubServiceCategoryZodValidationSchema.parse({
                    params: req.params,
                });
                // console.log('params', req.params)
                const subServiceCategoryId = get_single_sub_service_category_mapper_1.GetSingleSubServiceCategoryRequestMapper.toDTO(validated);
                // console.log('validation done', validated)
                const response = yield this._getSingleSubServiceCategoryUseCase.execute({
                    subServiceCategoryId,
                });
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.SUB_SERVICE_CATEGORY_FETCHED_SUCCESSFULLY,
                    data: response,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    toggleBlockStatusOfSubServiceCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validated = toggle_block_status_of_sub_service_category_schema_1.ToggleBlockStatusOfSubServiceCategoryZodValidationSchema.parse({
                    params: Object.assign(Object.assign({}, req.params), req.query),
                });
                const payload = toggle_block_status_of_sub_service_category_mapper_1.toggleBlockStatusOfSubServiceCategoryRequestMapper.toDTO(validated);
                const response = yield this._toggleBlockStatusOfSubServiceCategoryUseCase.execute(payload);
                res.json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.SUB_SERVICE_CATEGORY_STATUS_CHANGED_SUCCESSFULLY,
                    data: response,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    toggleVerificationStatusOfSubServiceCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log(
                //  'toggle verification status of sub service category,',
                //   req.params
                //  )
                const validated = toggle_verification_status_of_sub_service_category_schema_1.ToggleVerificationStatusOfSubServiceCategoryZodValidationSchema.parse({
                    payload: Object.assign(Object.assign({}, req.params), req.query),
                });
                const payload = toggle_verification_status_of_sub_service_category_mapper_1.ToggleVerificationStatusOfSubServiceCategoryRequestMapper.toDTO(validated);
                const response = yield this._toggleVerificationStatusOfSubServiceCategoryUseCase.execute(payload);
                res.json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.SUB_SERVICE_CATEGORY_VERIFICATION_STATUS_CHANGED_SUCCESSFULLY,
                    data: response,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    getVendorSubServiceCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //  console.log('get vendor sub service category controller')
                const validated = get_vendor_sub_service_category_schema_1.getVendorSubServiceCategoriesZodValidationSchema.parse(req.query);
                const vendorId = req.user.userId;
                const dto = get_vendor_sub_service_category_mapper_1.GetVendorSubServiceCategoriesRequestMapper.toDTO({
                    query: Object.assign(Object.assign({}, validated), { vendorId }),
                });
                const response = yield this._getVendorSubServiceCategoriesUseCase.execute(dto);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.SUB_SERVICE_CATEGORIES_FOUND_SUCCESSFULLY,
                    data: response,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    getAllSubServiceCategoriesBasedOnServiceCategoryId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //  console.log('The getAllsubServiceCatgoriesBase on servcategId', req.query)
                const validated = get_sub_service_categories_based_on_service_category_id_schema_1.GetAllSubServiceCategoriesBasedOnServiceCategoryIdZodValidationSchema.parse({ query: req.query });
                const dto = get_sub_service_catergories_based_on_service_category_mapper_1.GetAllSubServiceCategoriesBasedOnServiceCategoryIdRequestMapper.toDTO(validated);
                //  console.log('The dto', dto)
                const response = yield this._getAllSubServiceCategoriesBasedOnServiceCategoryIdUseCase.execute(dto);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.SUB_SERVICE_CATEGORIES_FOUND_SUCCESSFULLY,
                    data: response,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    getActiveSubServiceCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._getActiveSubServiceCategoriesUseCase.execute();
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.SUB_SERVICE_CATEGORIES_FOUND_SUCCESSFULLY,
                    data: response,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
};
exports.SubServiceCategoryController = SubServiceCategoryController;
exports.SubServiceCategoryController = SubServiceCategoryController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('ICreateSubServiceCategoryUseCase')),
    __param(1, (0, tsyringe_1.inject)('IGetAllSubServiceCategoryUseCase')),
    __param(2, (0, tsyringe_1.inject)('IEditSubServiceCategoryUseCase')),
    __param(3, (0, tsyringe_1.inject)('IGetSingleSubServiceCategoryUseCase')),
    __param(4, (0, tsyringe_1.inject)('IToggleBlockStatusOfSubServiceCategoryUseCase')),
    __param(5, (0, tsyringe_1.inject)('IToggleVerificationStatusOfSubServiceCategoryUseCase')),
    __param(6, (0, tsyringe_1.inject)('IGetVendorSubServiceCategoriesUseCase')),
    __param(7, (0, tsyringe_1.inject)('IGetAllSubServiceCategoriesBasedOnServiceCategoryIdUseCase')),
    __param(8, (0, tsyringe_1.inject)('IGetActiveSubServiceCategoriesUseCase')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object])
], SubServiceCategoryController);
