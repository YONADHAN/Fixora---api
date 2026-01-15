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
exports.NotificationRepository = void 0;
const tsyringe_1 = require("tsyringe");
const base_repository_1 = require("../../base_repository");
const notification_model_1 = require("../../../database/mongoDb/models/notification.model");
const custom_error_1 = require("../../../../domain/utils/custom.error");
let NotificationRepository = class NotificationRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(notification_model_1.NotificationModel);
    }
    toEntity(model) {
        return {
            _id: model._id.toString(),
            notificationId: model.notificationId,
            recipientId: model.recipientId,
            recipientRole: model.recipientRole,
            type: model.type,
            title: model.title,
            message: model.message,
            metadata: model.metadata,
            isRead: model.isRead,
            isActive: model.isActive,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
        };
    }
    toModel(entity) {
        var _a, _b;
        return {
            notificationId: entity.notificationId,
            recipientId: entity.recipientId,
            recipientRole: entity.recipientRole,
            type: entity.type,
            title: entity.title,
            message: entity.message,
            metadata: entity.metadata,
            isRead: (_a = entity.isRead) !== null && _a !== void 0 ? _a : false,
            isActive: (_b = entity.isActive) !== null && _b !== void 0 ? _b : true,
        };
    }
    findByRecipient(recipientId_1, limit_1, cursor_1) {
        return __awaiter(this, arguments, void 0, function* (recipientId, limit, cursor, filterType = 'all', search) {
            const query = {
                recipientId,
                isActive: true,
            };
            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { message: { $regex: search, $options: 'i' } },
                ];
            }
            if (filterType === 'unread') {
                query.isRead = false;
            }
            if (cursor) {
                query.createdAt = { $lt: new Date(cursor) };
            }
            const notifications = yield this.model
                .find(query)
                .sort({ createdAt: -1 })
                .limit(limit + 1)
                .lean();
            const hasNextPage = notifications.length > limit;
            const data = hasNextPage ? notifications.slice(0, -1) : notifications;
            const lastItem = data[data.length - 1];
            const nextCursor = lastItem ? lastItem.createdAt.toISOString() : null;
            const unreadCount = yield this.model.countDocuments({
                recipientId,
                isRead: false,
                isActive: true,
            });
            return {
                data: data.map((doc) => this.toEntity(doc)),
                nextCursor: hasNextPage ? nextCursor : null,
                unreadCount,
            };
        });
    }
    markAsRead(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.updateOne({ notificationId }, { $set: { isRead: true } });
            if (result.matchedCount === 0) {
                throw new custom_error_1.CustomError('Notification not found', 404);
            }
        });
    }
    markAllAsRead(recipientId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.updateMany({ recipientId, isRead: false }, { $set: { isRead: true } });
        });
    }
};
exports.NotificationRepository = NotificationRepository;
exports.NotificationRepository = NotificationRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], NotificationRepository);
