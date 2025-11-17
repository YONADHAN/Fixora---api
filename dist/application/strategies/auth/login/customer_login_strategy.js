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
exports.CustomerLoginStrategy = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../../../domain/utils/custom.error");
const constants_1 = require("../../../../shared/constants");
let CustomerLoginStrategy = class CustomerLoginStrategy {
    constructor(_customerRepository, _passwordBcrypt) {
        this._customerRepository = _customerRepository;
        this._passwordBcrypt = _passwordBcrypt;
    }
    async login(user) {
        const { email, password } = user;
        const customer = await this._customerRepository.findOne({ email });
        if (!customer)
            throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.USER_NOT_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
        if (!password) {
            throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.INVALID_CREDENTIALS, constants_1.HTTP_STATUS.BAD_REQUEST);
        }
        const isPasswordValid = await this._passwordBcrypt.compare(password, customer.password);
        if (!isPasswordValid)
            throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.INVALID_CREDENTIALS, constants_1.HTTP_STATUS.FORBIDDEN);
        if (customer.status === 'blocked')
            throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.BLOCKED, constants_1.HTTP_STATUS.FORBIDDEN);
        return customer;
    }
};
exports.CustomerLoginStrategy = CustomerLoginStrategy;
exports.CustomerLoginStrategy = CustomerLoginStrategy = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('ICustomerRepository')),
    __param(1, (0, tsyringe_1.inject)('IPasswordBcrypt')),
    __metadata("design:paramtypes", [Object, Object])
], CustomerLoginStrategy);
