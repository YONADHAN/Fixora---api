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
exports.CustomerController = void 0;
const tsyringe_1 = require("tsyringe");
require("reflect-metadata");
const constants_1 = require("../../../shared/constants");
const error_handler_1 = require("../../../shared/utils/error_handler");
const cookie_helper_1 = require("../../../shared/utils/cookie_helper");
let CustomerController = class CustomerController {
    constructor(_blacklistTokenUseCase, _revokeRefreshTokenUseCase, _getProfileInfoUseCase, _profileInfoUpdateUseCase) {
        this._blacklistTokenUseCase = _blacklistTokenUseCase;
        this._revokeRefreshTokenUseCase = _revokeRefreshTokenUseCase;
        this._getProfileInfoUseCase = _getProfileInfoUseCase;
        this._profileInfoUpdateUseCase = _profileInfoUpdateUseCase;
    }
    async logout(req, res) {
        try {
            await this._blacklistTokenUseCase.execute(req.user.access_token);
            await this._revokeRefreshTokenUseCase.execute(req.user.refresh_token);
            const user = req.user;
            const accessTokenName = `${user.role}_access_token`;
            const refreshTokenName = `${user.role}_refresh_token`;
            (0, cookie_helper_1.clearAuthCookies)(res, accessTokenName, refreshTokenName);
            res.status(200).json({
                success: true,
                message: 'Logged out successfully',
            });
        }
        catch (error) {
            (0, error_handler_1.handleErrorResponse)(req, res, error);
        }
    }
    async profileInfo(req, res) {
        try {
            const userId = req.user.userId;
            const role = req.user.role;
            const userData = await this._getProfileInfoUseCase.execute(role, userId);
            res.status(constants_1.HTTP_STATUS.OK).json({
                message: constants_1.SUCCESS_MESSAGES.PROFILE_FETCHED_SUCCESSFULLY,
                data: userData,
            });
        }
        catch (error) {
            (0, error_handler_1.handleErrorResponse)(req, res, error);
        }
    }
    async profileUpdate(req, res) {
        try {
            const data = req.body;
            const userId = req.user.userId;
            const role = req.user.role;
            await this._profileInfoUpdateUseCase.execute(role, data, userId);
            res.status(constants_1.HTTP_STATUS.OK).json({
                message: constants_1.SUCCESS_MESSAGES.PROFILE_UPDATED_SUCCESSFULLY,
            });
        }
        catch (error) {
            (0, error_handler_1.handleErrorResponse)(req, res, error);
        }
    }
};
exports.CustomerController = CustomerController;
exports.CustomerController = CustomerController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IBlacklistTokenUseCase')),
    __param(1, (0, tsyringe_1.inject)('IRevokeRefreshTokenUseCase')),
    __param(2, (0, tsyringe_1.inject)('IGetProfileInfoUseCase')),
    __param(3, (0, tsyringe_1.inject)('IProfileInfoUpdateUseCase')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], CustomerController);
