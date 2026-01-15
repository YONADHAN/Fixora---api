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
exports.PaymentHistoryFactory = void 0;
const tsyringe_1 = require("tsyringe");
const constants_1 = require("../../../shared/constants");
const custom_error_1 = require("../../../domain/utils/custom.error");
const constants_2 = require("../../../shared/constants");
let PaymentHistoryFactory = class PaymentHistoryFactory {
    constructor(_customerPaymentHistoryStrategy, _vendorPaymentHistoryStrategy) {
        this._customerPaymentHistoryStrategy = _customerPaymentHistoryStrategy;
        this._vendorPaymentHistoryStrategy = _vendorPaymentHistoryStrategy;
    }
    getStrategy(role) {
        switch (role) {
            case constants_1.ROLES.CUSTOMER:
                return this._customerPaymentHistoryStrategy;
            case constants_1.ROLES.VENDOR:
                return this._vendorPaymentHistoryStrategy;
            default:
                throw new custom_error_1.CustomError(constants_2.ERROR_MESSAGES.INVALID_ROLE, constants_2.HTTP_STATUS.FORBIDDEN);
        }
    }
};
exports.PaymentHistoryFactory = PaymentHistoryFactory;
exports.PaymentHistoryFactory = PaymentHistoryFactory = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IGetCustomerPaymentHistoryStrategy')),
    __param(1, (0, tsyringe_1.inject)('IGetVendorPaymentHistoryStrategy')),
    __metadata("design:paramtypes", [Object, Object])
], PaymentHistoryFactory);
