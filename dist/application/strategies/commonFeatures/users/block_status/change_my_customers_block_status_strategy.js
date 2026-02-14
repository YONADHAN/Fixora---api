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
exports.ChangeMyCustomersBlockStatusStrategy = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../../../../domain/utils/custom.error");
const constants_1 = require("../../../../../shared/constants");
const redis_client_1 = require("../../../../../interfaceAdapters/repositories/redis/redis.client");
let ChangeMyCustomersBlockStatusStrategy = class ChangeMyCustomersBlockStatusStrategy {
    constructor(_customerRepository) {
        this._customerRepository = _customerRepository;
    }
    execute(userId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const customer = yield this._customerRepository.findOne({ userId });
            if (!customer) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.USER_NOT_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
            }
            if (status === customer.status) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.STATUS_ALREADY_EXISTS, constants_1.HTTP_STATUS.CONFLICT);
            }
            customer.status = status;
            //await this._customerRepository.update(customer._id, customer)
            yield this._customerRepository.update({ _id: customer._id }, { status: customer.status });
            if (status == 'blocked') {
                yield redis_client_1.redisClient.set(`user_block_status:customer:${userId}`, status, {
                    EX: 3600,
                });
            }
            else if (status == 'active') {
                yield redis_client_1.redisClient.del(`user_block_status:customer:${userId}`);
            }
            return { message: `Customer ${status} successfully`, customer };
        });
    }
};
exports.ChangeMyCustomersBlockStatusStrategy = ChangeMyCustomersBlockStatusStrategy;
exports.ChangeMyCustomersBlockStatusStrategy = ChangeMyCustomersBlockStatusStrategy = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('ICustomerRepository')),
    __metadata("design:paramtypes", [Object])
], ChangeMyCustomersBlockStatusStrategy);
