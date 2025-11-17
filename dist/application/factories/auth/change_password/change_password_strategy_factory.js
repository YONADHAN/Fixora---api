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
exports.ChangePasswordFactory = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../../../domain/utils/custom.error");
let ChangePasswordFactory = class ChangePasswordFactory {
    constructor(_changeAdminPasswordStrategy, _changeVendorPasswordStrategy, _changeCustomerPasswordStrategy) {
        this._changeAdminPasswordStrategy = _changeAdminPasswordStrategy;
        this._changeVendorPasswordStrategy = _changeVendorPasswordStrategy;
        this._changeCustomerPasswordStrategy = _changeCustomerPasswordStrategy;
    }
    async execute(currentPassword, newPassword, userId, role) {
        switch (role) {
            case 'admin':
                return await this._changeAdminPasswordStrategy.execute(currentPassword, newPassword, userId);
            case 'vendor':
                return await this._changeVendorPasswordStrategy.execute(currentPassword, newPassword, userId);
            case 'customer':
                return await this._changeCustomerPasswordStrategy.execute(currentPassword, newPassword, userId);
            default:
                throw new custom_error_1.CustomError('Invalid role provided', 400);
        }
    }
};
exports.ChangePasswordFactory = ChangePasswordFactory;
exports.ChangePasswordFactory = ChangePasswordFactory = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IChangeAdminPasswordStrategy')),
    __param(1, (0, tsyringe_1.inject)('IChangeVendorPasswordStrategy')),
    __param(2, (0, tsyringe_1.inject)('IChangeCustomerPasswordStrategy')),
    __metadata("design:paramtypes", [Object, Object, Object])
], ChangePasswordFactory);
