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
exports.AddressController = void 0;
const tsyringe_1 = require("tsyringe");
require("reflect-metadata");
const error_handler_1 = require("../../../shared/utils/error_handler");
const constants_1 = require("../../../shared/constants");
const get_addresses_schema_1 = require("../../validations/address/get_addresses_schema");
const get_addresses_mapper_1 = require("../../../application/mappers/address/get_addresses_mapper");
const add_address_schema_1 = require("../../validations/address/add_address_schema");
const edit_address_schema_1 = require("../../validations/address/edit_address_schema");
const set_default_address_schema_1 = require("../../validations/address/set_default_address_schema");
const delete_address_schema_1 = require("../../validations/address/delete_address_schema");
const get_single_address_schema_1 = require("../../validations/address/get_single_address_schema");
let AddressController = class AddressController {
    constructor(_getAddressUseCase, _addAddressUseCase, _editAddressUseCase, _setDefaultAddressUseCase, _deleteAddressUseCase, _getSingleAddressUseCase) {
        this._getAddressUseCase = _getAddressUseCase;
        this._addAddressUseCase = _addAddressUseCase;
        this._editAddressUseCase = _editAddressUseCase;
        this._setDefaultAddressUseCase = _setDefaultAddressUseCase;
        this._deleteAddressUseCase = _deleteAddressUseCase;
        this._getSingleAddressUseCase = _getSingleAddressUseCase;
    }
    getAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = req;
                const basic = get_addresses_schema_1.GetAddressBasicSchema.parse(Object.assign(Object.assign({}, req.query), { customerId: user === null || user === void 0 ? void 0 : user.userId }));
                const dto = get_addresses_mapper_1.GetAddressRequestMapper.toDTO(basic);
                const validatedDTO = get_addresses_schema_1.GetAddressRequestSchema.parse(dto);
                const data = yield this._getAddressUseCase.execute(validatedDTO);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.ADDRESS_FOUND_SUCCESSFULLY,
                    data,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    addAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = req;
                const validatedDTO = add_address_schema_1.AddAddressRequestSchema.parse(Object.assign(Object.assign({}, req.body), { customerId: user === null || user === void 0 ? void 0 : user.userId }));
                yield this._addAddressUseCase.execute(validatedDTO);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.ADDRESS_ADDED_SUCCESSFULLY,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    editAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validatedDTO = edit_address_schema_1.EditAddressRequestSchema.parse(Object.assign(Object.assign({}, req.body), { addressId: req.params.addressId }));
                yield this._editAddressUseCase.execute(validatedDTO);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.EDIT_ADDRESS_SUCCESSFULLY,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    setDefaultAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const basic = set_default_address_schema_1.SetDefaultAddressBasicSchema.parse(req.body);
                const validatedDTO = set_default_address_schema_1.SetDefaultAddressRequestSchema.parse(basic);
                yield this._setDefaultAddressUseCase.execute({
                    addressId: validatedDTO.addressId,
                });
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.ADDRESS_SET_AS_DEFAULT_ADDRESS_SUCCESSFULLY,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    deleteAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const basic = delete_address_schema_1.DeleteAddressBasicSchema.parse(req.params);
                const validatedDTO = delete_address_schema_1.DeleteAddressRequestSchema.parse(basic);
                yield this._deleteAddressUseCase.execute({
                    addressId: validatedDTO.addressId,
                });
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.DELETED_SELECTED_ADDRESS_SUCCESSFULLY,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    getSingleAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validatedDTO = get_single_address_schema_1.GetSingleAddressSchema.parse(req.params);
                const data = yield this._getSingleAddressUseCase.execute(validatedDTO);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.ADDRESS_FOUND_SUCCESSFULLY,
                    data,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
};
exports.AddressController = AddressController;
exports.AddressController = AddressController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IGetAddressUseCase')),
    __param(1, (0, tsyringe_1.inject)('IAddAddressUseCase')),
    __param(2, (0, tsyringe_1.inject)('IEditAddressUseCase')),
    __param(3, (0, tsyringe_1.inject)('ISetDefaultAddressUseCase')),
    __param(4, (0, tsyringe_1.inject)('IDeleteAddressUseCase')),
    __param(5, (0, tsyringe_1.inject)('IGetSingleAddressUseCase')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], AddressController);
