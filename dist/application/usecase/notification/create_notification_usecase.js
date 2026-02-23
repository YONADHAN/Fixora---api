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
exports.CreateNotificationUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const uuid_1 = require("uuid");
const socket_server_1 = require("../../../presentation/socket/socket.server");
const constants_1 = require("../../../shared/constants");
let CreateNotificationUseCase = class CreateNotificationUseCase {
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    execute(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = {
                notificationId: (0, uuid_1.v4)(),
                recipientId: data.recipientId,
                recipientRole: data.recipientRole,
                type: data.type,
                title: data.title,
                message: data.message,
                metadata: data.metadata,
                isRead: false,
                isActive: true,
                createdAt: new Date(),
            };
            const saved = yield this.notificationRepository.save(notification);
            const socketPayload = {
                notificationId: saved.notificationId,
                title: saved.title,
                message: saved.message,
                type: saved.type,
                metadata: saved.metadata,
                createdAt: saved.createdAt,
            };
            try {
                const io = (0, socket_server_1.getIO)();
                io.to(`user:${data.recipientId}`).emit(constants_1.SOCKET_EVENTS.NOTIFICATION_NEW, saved);
            }
            catch (err) {
                console.error('Socket notification emit failed', err);
            }
            return saved;
        });
    }
};
exports.CreateNotificationUseCase = CreateNotificationUseCase;
exports.CreateNotificationUseCase = CreateNotificationUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('INotificationRepository')),
    __metadata("design:paramtypes", [Object])
], CreateNotificationUseCase);
