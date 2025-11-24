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
exports.CustomerController = void 0;
const tsyringe_1 = require("tsyringe");
require("reflect-metadata");
const constants_1 = require("../../../shared/constants");
const error_handler_1 = require("../../../shared/utils/error_handler");
const cookie_helper_1 = require("../../../shared/utils/cookie_helper");
const config_1 = require("../../../shared/config");
let CustomerController = class CustomerController {
    constructor(_blacklistTokenUseCase, _revokeRefreshTokenUseCase, _getProfileInfoUseCase, _profileInfoUpdateUseCase, storageService, _profileImageUploadFactory) {
        this._blacklistTokenUseCase = _blacklistTokenUseCase;
        this._revokeRefreshTokenUseCase = _revokeRefreshTokenUseCase;
        this._getProfileInfoUseCase = _getProfileInfoUseCase;
        this._profileInfoUpdateUseCase = _profileInfoUpdateUseCase;
        this.storageService = storageService;
        this._profileImageUploadFactory = _profileImageUploadFactory;
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._blacklistTokenUseCase.execute(req.user.access_token);
                yield this._revokeRefreshTokenUseCase.execute(req.user.refresh_token);
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
        });
    }
    profileInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.userId;
                const role = req.user.role;
                const userData = yield this._getProfileInfoUseCase.execute(role, userId);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    message: constants_1.SUCCESS_MESSAGES.PROFILE_FETCHED_SUCCESSFULLY,
                    data: userData,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    profileUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const userId = req.user.userId;
                const role = req.user.role;
                yield this._profileInfoUpdateUseCase.execute(role, data, userId);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    message: constants_1.SUCCESS_MESSAGES.PROFILE_UPDATED_SUCCESSFULLY,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    uploadProfileImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customerId = req.user.id;
                const file = req.file;
                if (!file) {
                    res.status(400).json({ message: 'No file uploaded' });
                    return;
                }
                const bucketName = config_1.config.storageConfig.bucket;
                const folder = 'profile-images';
                const uploadedProfileImageUrl = yield this.storageService.uploadFile(bucketName, file, folder);
                yield this._profileImageUploadFactory.execute('customer', customerId, uploadedProfileImageUrl);
                res.status(200).json({
                    success: true,
                    message: 'Profile image updated successfully',
                    imageUrl: uploadedProfileImageUrl,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
};
exports.CustomerController = CustomerController;
exports.CustomerController = CustomerController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IBlacklistTokenUseCase')),
    __param(1, (0, tsyringe_1.inject)('IRevokeRefreshTokenUseCase')),
    __param(2, (0, tsyringe_1.inject)('IGetProfileInfoUseCase')),
    __param(3, (0, tsyringe_1.inject)('IProfileInfoUpdateUseCase')),
    __param(4, (0, tsyringe_1.inject)('IStorageService')),
    __param(5, (0, tsyringe_1.inject)('IProfileImageUploadFactory')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], CustomerController);
