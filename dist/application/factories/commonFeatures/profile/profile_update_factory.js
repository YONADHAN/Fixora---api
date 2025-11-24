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
exports.ProfileUpdateFactory = void 0;
const tsyringe_1 = require("tsyringe");
let ProfileUpdateFactory = class ProfileUpdateFactory {
    constructor(_customerStrategy, _vendorStrategy) {
        this._customerStrategy = _customerStrategy;
        this._vendorStrategy = _vendorStrategy;
    }
    getStrategy(role, data, userId) {
        switch (role.toLowerCase()) {
            case 'customer':
                return this._customerStrategy.execute({ data, userId });
            case 'vendor':
                return this._vendorStrategy.execute({ data, userId });
            default:
                throw new Error(`Can't update the datas of ${role} ${userId}`);
        }
    }
};
exports.ProfileUpdateFactory = ProfileUpdateFactory;
exports.ProfileUpdateFactory = ProfileUpdateFactory = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('ICustomerProfileUpdateStrategy')),
    __param(1, (0, tsyringe_1.inject)('IVendorProfileUpdateStrategy')),
    __metadata("design:paramtypes", [Object, Object])
], ProfileUpdateFactory);
