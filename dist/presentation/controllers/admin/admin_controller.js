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
exports.AdminController = void 0;
const tsyringe_1 = require("tsyringe");
const constants_1 = require("../../../shared/constants");
const error_handler_1 = require("../../../shared/utils/error_handler");
const cookie_helper_1 = require("../../../shared/utils/cookie_helper");
let AdminController = class AdminController {
    constructor(_blacklistTokenUseCase, _revokeRefreshTokenUseCase, _getAllUsersUsecase, _changeMyUserBlockStatusUseCase, _getAllVendorRequests, _changeVendorVerificationStatusUseCase) {
        this._blacklistTokenUseCase = _blacklistTokenUseCase;
        this._revokeRefreshTokenUseCase = _revokeRefreshTokenUseCase;
        this._getAllUsersUsecase = _getAllUsersUsecase;
        this._changeMyUserBlockStatusUseCase = _changeMyUserBlockStatusUseCase;
        this._getAllVendorRequests = _getAllVendorRequests;
        this._changeVendorVerificationStatusUseCase = _changeVendorVerificationStatusUseCase;
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
    getAllCustomers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10, search = '', role = 'customer' } = req.body;
                const response = yield this._getAllUsersUsecase.execute({
                    role,
                    page,
                    limit,
                    search,
                });
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.USERS_FOUND,
                    data: response,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    getAllVendors(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10, search = '', role = 'vendor' } = req.body;
                const response = yield this._getAllUsersUsecase.execute({
                    role,
                    page,
                    limit,
                    search,
                });
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.USERS_FOUND,
                    data: response,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    getAllVendorRequests(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const search = req.query.search || '';
                const response = yield this._getAllVendorRequests.execute({
                    page,
                    limit,
                    search,
                });
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: 'Vendor requests retrieved successfully',
                    data: response,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    changeMyUserBlockStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { role, userId, status } = req.body;
                if (!role || !userId || !status) {
                    return res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: 'role, userId, and status are required',
                    });
                }
                const validStatuses = ['active', 'blocked'];
                if (!validStatuses.includes(status)) {
                    return res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: `Invalid status value. Allowed: ${validStatuses.join(', ')}`,
                    });
                }
                const response = yield this._changeMyUserBlockStatusUseCase.execute({
                    role,
                    userId,
                    status,
                });
                return res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.BLOCK_STATUS_OF_USER_CHANGED_SUCCESSFULLY,
                    data: response,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    changeMyVendorVerificationStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log('Entered the change my vendor veriifaction controller')
                const adminId = req.user.userId;
                const { userId, verificationStatus, description } = req.body;
                //console.log('adminId', adminId)
                //console.log('req.body', req.body)
                if (!['rejected', 'accepted'].includes(verificationStatus)) {
                    res
                        .status(constants_1.HTTP_STATUS.BAD_REQUEST)
                        .json({ message: constants_1.ERROR_MESSAGES.INVALID_CREDENTIALS });
                    return;
                }
                // console.log('going to work in usecase')
                const response = yield this._changeVendorVerificationStatusUseCase.execute({
                    userId,
                    verificationStatus,
                    adminId,
                    description,
                });
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.VERIFICATION_STATUS_CHANGED,
                    data: response,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
};
exports.AdminController = AdminController;
exports.AdminController = AdminController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IBlacklistTokenUseCase')),
    __param(1, (0, tsyringe_1.inject)('IRevokeRefreshTokenUseCase')),
    __param(2, (0, tsyringe_1.inject)('IGetAllUsersUseCase')),
    __param(3, (0, tsyringe_1.inject)('IChangeMyUserBlockStatusUseCase')),
    __param(4, (0, tsyringe_1.inject)('IGetAllVendorRequestsUseCase')),
    __param(5, (0, tsyringe_1.inject)('IChangeVendorVerificationStatusUseCase')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], AdminController);
