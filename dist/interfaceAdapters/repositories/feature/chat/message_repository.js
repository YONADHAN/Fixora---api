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
exports.MessageRepository = void 0;
const tsyringe_1 = require("tsyringe");
const base_repository_1 = require("../../base_repository");
const message_model_1 = require("../../../database/mongoDb/models/message_model");
let MessageRepository = class MessageRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(message_model_1.MessageModel);
    }
    /* ----------------------------- MAPPERS ----------------------------- */
    toEntity(model) {
        return {
            _id: model._id.toString(),
            messageId: model.messageId,
            chatId: model.chatId,
            senderId: model.senderId,
            senderRole: model.senderRole,
            content: model.content,
            messageType: model.messageType,
            replyTo: model.replyTo,
            booking: model.booking,
            isRead: model.isRead,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
        };
    }
    toModel(entity) {
        return {
            messageId: entity.messageId,
            chatId: entity.chatId,
            senderId: entity.senderId,
            senderRole: entity.senderRole,
            content: entity.content,
            messageType: entity.messageType,
            replyTo: entity.replyTo,
            booking: entity.booking,
            isRead: entity.isRead,
        };
    }
    /* --------------------------- REPOSITORY API -------------------------- */
    createMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const created = yield this.model.create(this.toModel(Object.assign(Object.assign({}, data), { isRead: false })));
            return this.toEntity(created.toObject());
        });
    }
    findMessagesByChatId(chatId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const filter = { chatId };
            const [documents, totalCount] = yield Promise.all([
                this.model
                    .find(filter)
                    .sort({ createdAt: 1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                this.model.countDocuments(filter),
            ]);
            return {
                data: documents.map((doc) => this.toEntity(doc)),
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
            };
        });
    }
    markMessagesAsRead(chatId, readerId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.updateMany({
                chatId,
                senderId: { $ne: readerId },
                isRead: false,
            }, { $set: { isRead: true } });
        });
    }
};
exports.MessageRepository = MessageRepository;
exports.MessageRepository = MessageRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], MessageRepository);
