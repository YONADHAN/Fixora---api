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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationStrategyFactory = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../../../domain/utils/custom.error");
const constants_1 = require("../../../../shared/constants");
let RegistrationStrategyFactory = class RegistrationStrategyFactory {
    constructor(_customerRegistration, _adminRegistration, _vendorRegistration) {
        this._customerRegistration = _customerRegistration;
        this._adminRegistration = _adminRegistration;
        this._vendorRegistration = _vendorRegistration;
    }
    getStrategy(role) {
        switch (role) {
            case 'customer':
                return this._customerRegistration;
            case 'admin':
                return this._adminRegistration;
            case 'vendor':
                return this._vendorRegistration;
            default:
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.INVALID_ROLE, constants_1.HTTP_STATUS.BAD_REQUEST);
        }
    }
};
exports.RegistrationStrategyFactory = RegistrationStrategyFactory;
exports.RegistrationStrategyFactory = RegistrationStrategyFactory = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('ICustomerRegistrationStrategy')),
    __param(1, (0, tsyringe_1.inject)('IAdminRegistrationStrategy')),
    __param(2, (0, tsyringe_1.inject)('IVendorRegistrationStrategy')),
    __metadata("design:paramtypes", [Object, Object, Object])
], RegistrationStrategyFactory);
