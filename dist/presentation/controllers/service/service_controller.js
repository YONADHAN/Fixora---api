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
exports.ServiceController = void 0;
const tsyringe_1 = require("tsyringe");
const error_handler_1 = require("../../../shared/utils/error_handler");
const constants_1 = require("../../../shared/constants");
const create_service_schema_1 = require("../../validations/service/create_service.schema");
const create_service_mapper_1 = require("../../../application/mappers/service/create_service_mapper");
const get_all_services_schema_1 = require("../../validations/service/get_all_services.schema");
const get_all_service_mapper_1 = require("../../../application/mappers/service/get_all_service_mapper");
const get_service_by_id_schema_1 = require("../../validations/service/get_service_by_id.schema");
const get_service_by_id_mapper_1 = require("../../../application/mappers/service/get_service_by_id_mapper");
const edit_service_schema_1 = require("../../validations/service/edit_service.schema");
const edit_service_mapper_1 = require("../../../application/mappers/service/edit_service_mapper");
const toggle_service_block_status_1 = require("../../validations/service/toggle_service_block_status");
const search_services_for_customer_mapper_1 = require("../../../application/mappers/service/search_services_for_customer_mapper");
const search_services_for_customer_schema_1 = require("../../validations/service/search_services_for_customer.schema");
let ServiceController = class ServiceController {
    constructor(_createServiceUseCase, _getAllServicesUseCase, _getServiceByIdUseCase, _editServiceUseCase, _toggleBlockServiceUseCase, _searchServicesForCustomersUseCase) {
        this._createServiceUseCase = _createServiceUseCase;
        this._getAllServicesUseCase = _getAllServicesUseCase;
        this._getServiceByIdUseCase = _getServiceByIdUseCase;
        this._editServiceUseCase = _editServiceUseCase;
        this._toggleBlockServiceUseCase = _toggleBlockServiceUseCase;
        this._searchServicesForCustomersUseCase = _searchServicesForCustomersUseCase;
    }
    createService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const validated = create_service_schema_1.createServiceZodValidationSchema.parse(Object.assign(Object.assign({}, req.body), { files: req.files }));
                const vendorId = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) !== null && _b !== void 0 ? _b : '';
                const rawData = Object.assign(Object.assign({}, validated), { vendorId });
                const dto = create_service_mapper_1.CreateServiceRequestMapper.toDTO({
                    rawData,
                    files: req.files,
                });
                yield this._createServiceUseCase.execute(dto);
                res.status(constants_1.HTTP_STATUS.CREATED).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.SERVICE_CREATED_SUCCESSFULLY,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    getAllServices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const vendorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                let validated = get_all_services_schema_1.getAllServicesZodValidationSchema.parse({
                    query: Object.assign(Object.assign({}, req.query), { vendorId }),
                });
                const dto = get_all_service_mapper_1.GetAllServicesRequestMapper.toDTO(validated);
                const response = yield this._getAllServicesUseCase.execute(dto);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.SERVICE_FOUND_SUCCESSFULLY,
                    data: response,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    getServiceById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validated = get_service_by_id_schema_1.GetServiceByIdZodValidationSchema.parse({
                    params: req.params,
                });
                const dto = get_service_by_id_mapper_1.GetServiceByIdRequestMapper.toDTO(validated);
                const response = yield this._getServiceByIdUseCase.execute(dto);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.SERVICE_FOUND_SUCCESSFULLY,
                    data: response,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    editService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('inputs', Object.assign(Object.assign({}, req.params), req.body));
                if (req.files) {
                    console.log('files received');
                }
                const validated = edit_service_schema_1.editServiceZodValidationSchema.parse(Object.assign(Object.assign(Object.assign({}, req.params), req.body), { files: req.files }));
                console.log('Validated', validated);
                const { serviceId } = validated;
                const vendorId = req.user.userId;
                const dto = edit_service_mapper_1.EditServiceRequestMapper.toDTO(Object.assign(Object.assign({}, validated), { vendorId, files: req.files }));
                console.log('dto', dto);
                yield this._editServiceUseCase.execute(dto);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: 'Service updated successfully',
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    toggleServiceBlock(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validated = toggle_service_block_status_1.toggleServiceBlockZodValidationSchema.parse({
                    params: req.params,
                });
                const result = yield this._toggleBlockServiceUseCase.execute(validated.params);
                res.status(200).json({
                    success: true,
                    message: `Service ${result.isActiveStatusByVendor ? 'unblocked' : 'blocked'} successfully`,
                    data: result,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    searchServicesForCustomer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const basic = search_services_for_customer_schema_1.SearchCustomerServicesBasicSchema.parse(req.query);
                const dto = search_services_for_customer_mapper_1.RequestSearchServicesForCustomerRequestMapper.toDTO(basic);
                const validatedDTO = search_services_for_customer_schema_1.SearchCustomerServicesDTOSchema.parse(dto);
                const response = yield this._searchServicesForCustomersUseCase.execute(validatedDTO);
                res.status(200).json({
                    success: true,
                    message: 'Service found successfully',
                    data: response,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
};
exports.ServiceController = ServiceController;
exports.ServiceController = ServiceController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('ICreateServiceUseCase')),
    __param(1, (0, tsyringe_1.inject)('IGetAllServicesUseCase')),
    __param(2, (0, tsyringe_1.inject)('IGetServiceByIdUseCase')),
    __param(3, (0, tsyringe_1.inject)('IEditServiceUseCase')),
    __param(4, (0, tsyringe_1.inject)('IToggleBlockServiceUseCase')),
    __param(5, (0, tsyringe_1.inject)('ISearchServicesForCustomersUseCase')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], ServiceController);
