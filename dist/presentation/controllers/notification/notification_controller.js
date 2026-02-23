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
exports.NotificationController = void 0;
require("reflect-metadata");
const tsyringe_1 = require("tsyringe");
const error_handler_1 = require("../../../shared/utils/error_handler");
const constants_1 = require("../../../shared/constants");
let NotificationController = class NotificationController {
    constructor(getMyNotificationsUseCase, markNotificationReadUseCase, markAllNotificationsReadUseCase, createNotificationUseCase) {
        this.getMyNotificationsUseCase = getMyNotificationsUseCase;
        this.markNotificationReadUseCase = markNotificationReadUseCase;
        this.markAllNotificationsReadUseCase = markAllNotificationsReadUseCase;
        this.createNotificationUseCase = createNotificationUseCase;
    }
    getMyNotifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { cursor, limit = 10, filter = 'all', search } = req.query;
                const user = req.user;
                const result = yield this.getMyNotificationsUseCase.execute({
                    userId: user.userId,
                    limit: Number(limit),
                    cursor: cursor,
                    filter: filter,
                    search: search,
                });
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    data: result,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    markNotificationRead(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { notificationId } = req.params;
                const user = req.user;
                yield this.markNotificationReadUseCase.execute(notificationId, user.userId);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.UPDATED,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    markAllNotificationsRead(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                yield this.markAllNotificationsReadUseCase.execute(user.userId);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.UPDATED,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
};
exports.NotificationController = NotificationController;
exports.NotificationController = NotificationController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IGetMyNotificationsUseCase')),
    __param(1, (0, tsyringe_1.inject)('IMarkNotificationReadUseCase')),
    __param(2, (0, tsyringe_1.inject)('IMarkAllNotificationsReadUseCase')),
    __param(3, (0, tsyringe_1.inject)('ICreateNotificationUseCase')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], NotificationController);
