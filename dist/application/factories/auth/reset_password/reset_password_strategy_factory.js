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
exports.ResetPasswordStrategyFactory = void 0;
const tsyringe_1 = require("tsyringe");
const constants_1 = require("../../../../shared/constants");
const custom_error_1 = require("../../../../domain/utils/custom.error");
let ResetPasswordStrategyFactory = class ResetPasswordStrategyFactory {
    constructor(_adminResetPassword, _vendorResetPassword, _customerResetPassword) {
        this._adminResetPassword = _adminResetPassword;
        this._vendorResetPassword = _vendorResetPassword;
        this._customerResetPassword = _customerResetPassword;
    }
    getStrategy(role) {
        switch (role) {
            case 'admin':
                return this._adminResetPassword;
            case 'vendor':
                return this._vendorResetPassword;
            case 'customer':
                return this._customerResetPassword;
            default:
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.INVALID_ROLE, constants_1.HTTP_STATUS.BAD_REQUEST);
        }
    }
};
exports.ResetPasswordStrategyFactory = ResetPasswordStrategyFactory;
exports.ResetPasswordStrategyFactory = ResetPasswordStrategyFactory = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IAdminResetPasswordStrategy')),
    __param(1, (0, tsyringe_1.inject)('IVendorResetPasswordStrategy')),
    __param(2, (0, tsyringe_1.inject)('ICustomerResetPasswordStrategy')),
    __metadata("design:paramtypes", [Object, Object, Object])
], ResetPasswordStrategyFactory);
