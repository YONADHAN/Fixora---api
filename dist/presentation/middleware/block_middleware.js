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
exports.BlockMyUserMiddleware = void 0;
const redis_client_1 = require("../../interfaceAdapters/repositories/redis/redis.client");
const tsyringe_1 = require("tsyringe");
const cookie_helper_1 = require("../../shared/utils/cookie_helper");
const constants_1 = require("../../shared/constants");
let BlockMyUserMiddleware = class BlockMyUserMiddleware {
    constructor(_customerRepository, _vendorRepository, _revokeRefreshTokenUsecase, _blacklistTokenUsecase) {
        this._customerRepository = _customerRepository;
        this._vendorRepository = _vendorRepository;
        this._revokeRefreshTokenUsecase = _revokeRefreshTokenUsecase;
        this._blacklistTokenUsecase = _blacklistTokenUsecase;
        this.checkMyUserBlockStatus = async (req, res, next) => {
            try {
                const user = req.user;
                if (!user) {
                    res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.USER_NOT_FOUND,
                    });
                    return;
                }
                const { userId, role } = req.user;
                const cacheKey = `user_block_status:${role}:${userId}`;
                let status = await redis_client_1.redisClient.get(cacheKey);
                if (!status) {
                    if (role === 'customer') {
                        const customer = await this._customerRepository.findOne({ userId });
                        if (!customer) {
                            res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                                success: false,
                                message: constants_1.ERROR_MESSAGES.USER_NOT_FOUND,
                            });
                            return;
                        }
                        status = customer.status;
                    }
                    else if (role === 'vendor') {
                        const vendor = await this._vendorRepository.findOne({ userId });
                        if (!vendor) {
                            res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                                success: false,
                                message: constants_1.ERROR_MESSAGES.USERS_NOT_FOUND,
                            });
                            return;
                        }
                        status = vendor.status;
                    }
                    else {
                        res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                            success: false,
                            message: constants_1.ERROR_MESSAGES.INVALID_ROLE,
                        });
                        return;
                    }
                    await redis_client_1.redisClient.set(cacheKey, String(status ?? 'null'), { EX: 3600 });
                }
                if (status !== 'active') {
                    try {
                        await this._blacklistTokenUsecase.execute(req.user.access_token);
                        await this._revokeRefreshTokenUsecase.execute(req.user.refresh_token);
                    }
                    catch (err) {
                        console.warn('Token revoke or blacklist failed:', err);
                    }
                    const accessTokenName = `${role}_access_token`;
                    const refreshTokenName = `${role}_refresh_token`;
                    (0, cookie_helper_1.clearAuthCookies)(res, accessTokenName, refreshTokenName);
                    return res.status(constants_1.HTTP_STATUS.FORBIDDEN).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.BLOCKED,
                    });
                }
                next();
            }
            catch (error) {
                if (error instanceof Error)
                    return res.status(constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.SERVER_ERROR,
                    });
            }
        };
    }
};
exports.BlockMyUserMiddleware = BlockMyUserMiddleware;
exports.BlockMyUserMiddleware = BlockMyUserMiddleware = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('ICustomerRepository')),
    __param(1, (0, tsyringe_1.inject)('IVendorRepository')),
    __param(2, (0, tsyringe_1.inject)('IRevokeRefreshTokenUseCase')),
    __param(3, (0, tsyringe_1.inject)('IBlacklistTokenUseCase')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], BlockMyUserMiddleware);
