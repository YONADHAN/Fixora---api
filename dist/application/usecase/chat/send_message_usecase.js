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
exports.SendMessageUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const uuid_1 = require("uuid");
const custom_error_1 = require("../../../domain/utils/custom.error");
let SendMessageUseCase = class SendMessageUseCase {
    constructor(chatRepository, messageRepository) {
        this.chatRepository = chatRepository;
        this.messageRepository = messageRepository;
    }
    execute(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { chatId, senderId, senderRole, content, messageType = 'text', replyTo, booking, } = input;
            const chat = yield this.chatRepository.findByChatId(chatId);
            if (!chat) {
                throw new custom_error_1.CustomError('Chat not found', 404);
            }
            /*  Authorize sender */
            /*  Authorize sender */
            const isCustomer = senderRole === 'customer' && chat.customer.userId === senderId;
            const isVendor = senderRole === 'vendor' && chat.vendor.userId === senderId;
            if (!isCustomer && !isVendor) {
                throw new custom_error_1.CustomError('You are not a participant of this chat', 403);
            }
            /*  Create message */
            const message = yield this.messageRepository.createMessage({
                messageId: (0, uuid_1.v4)(),
                chatId,
                senderId,
                senderRole,
                content,
                messageType,
                replyTo,
                booking,
                isRead: false,
            });
            /*  Update chat last message */
            yield this.chatRepository.updateLastMessage(chatId, {
                messageId: message.messageId,
                content: message.content,
                senderId: message.senderId,
                senderRole: message.senderRole,
                createdAt: message.createdAt,
            });
            /*  Increment unread count for receiver */
            const receiverRole = senderRole === 'customer' ? 'vendor' : 'customer';
            yield this.chatRepository.incrementUnread(chatId, receiverRole);
            /*  Return message */
            return {
                message,
                chat: Object.assign(Object.assign({}, chat), { lastMessage: {
                        messageId: message.messageId,
                        content: message.content,
                        senderId: message.senderId,
                        senderRole: message.senderRole,
                        createdAt: message.createdAt,
                    }, unreadCount: {
                        customer: senderRole === 'vendor' ? chat.unreadCount.customer + 1 : chat.unreadCount.customer,
                        vendor: senderRole === 'customer' ? chat.unreadCount.vendor + 1 : chat.unreadCount.vendor,
                    } }) // Casting to avoid complex type matching if entity differs slightly from model
            };
        });
    }
};
exports.SendMessageUseCase = SendMessageUseCase;
exports.SendMessageUseCase = SendMessageUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IChatRepository')),
    __param(1, (0, tsyringe_1.inject)('IMessageRepository')),
    __metadata("design:paramtypes", [Object, Object])
], SendMessageUseCase);
