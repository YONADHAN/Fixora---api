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
exports.ChatRepository = void 0;
const tsyringe_1 = require("tsyringe");
const base_repository_1 = require("../../base_repository");
const chat_model_1 = require("../../../database/mongoDb/models/chat_model");
const custom_error_1 = require("../../../../domain/utils/custom.error");
let ChatRepository = class ChatRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(chat_model_1.ChatModel);
    }
    toEntity(model) {
        return {
            _id: model._id.toString(),
            chatId: model.chatId,
            customerId: model.customerId,
            vendorId: model.vendorId,
            serviceId: model.serviceId,
            lastMessage: model.lastMessage,
            unreadCount: model.unreadCount,
            isActive: model.isActive,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
        };
    }
    toModel(entity) {
        return {
            chatId: entity.chatId,
            customerId: entity.customerId,
            vendorId: entity.vendorId,
            serviceId: entity.serviceId,
            lastMessage: entity.lastMessage,
            unreadCount: entity.unreadCount,
            isActive: entity.isActive,
        };
    }
    findChatByParticipants(customerId, vendorId, serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chat = yield this.model
                .findOne({ customerId, vendorId, serviceId })
                .lean();
            return chat ? this.toEntity(chat) : null;
        });
    }
    createChat(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const created = yield this.model.create(this.toModel(Object.assign(Object.assign({}, data), { unreadCount: (_a = data.unreadCount) !== null && _a !== void 0 ? _a : {
                        customer: 0,
                        vendor: 0,
                    }, isActive: true })));
                return this.toEntity(created.toObject());
            }
            catch (error) {
                if (error.code === 11000) {
                    throw new custom_error_1.CustomError('Chat already exists', 409);
                }
                throw error;
            }
        });
    }
    getUserChats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chats = yield this.model
                .find({
                $or: [{ customerId: userId }, { vendorId: userId }],
            })
                .sort({ updatedAt: -1 })
                .lean();
            return chats.map((chat) => this.toEntity(chat));
        });
    }
    incrementUnread(chatId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.updateOne({ chatId }, { $inc: { [`unreadCount.${role}`]: 1 } });
        });
    }
    resetUnread(chatId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.updateOne({ chatId }, { $set: { [`unreadCount.${role}`]: 0 } });
        });
    }
    updateLastMessage(chatId, lastMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.updateOne({ chatId }, { $set: { lastMessage } });
        });
    }
    deactivateChat(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.updateOne({ chatId }, { $set: { isActive: false } });
        });
    }
    findByChatId(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chat = yield this.model
                .findOne({ chatId })
                .lean();
            return chat ? this.toEntity(chat) : null;
        });
    }
};
exports.ChatRepository = ChatRepository;
exports.ChatRepository = ChatRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], ChatRepository);
