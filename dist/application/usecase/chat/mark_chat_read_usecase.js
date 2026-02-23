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
exports.MarkChatReadUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../../domain/utils/custom.error");
let MarkChatReadUseCase = class MarkChatReadUseCase {
    constructor(chatRepository, messageRepository) {
        this.chatRepository = chatRepository;
        this.messageRepository = messageRepository;
    }
    execute(input) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { chatId, readerId, readerRole } = input;
            const chat = yield this.chatRepository.findByChatId(chatId);
            if (!chat) {
                throw new custom_error_1.CustomError('Chat not found', 404);
            }
            const isCustomer = readerRole === 'customer' && ((_a = chat.customer) === null || _a === void 0 ? void 0 : _a.userId) === readerId;
            const isVendor = readerRole === 'vendor' && ((_b = chat.vendor) === null || _b === void 0 ? void 0 : _b.userId) === readerId;
            if (!isCustomer && !isVendor) {
                throw new custom_error_1.CustomError('You are not allowed to read this chat', 403);
            }
            yield this.chatRepository.resetUnread(chatId, readerRole);
            yield this.messageRepository.markMessagesAsRead(chatId, readerId);
        });
    }
};
exports.MarkChatReadUseCase = MarkChatReadUseCase;
exports.MarkChatReadUseCase = MarkChatReadUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IChatRepository')),
    __param(1, (0, tsyringe_1.inject)('IMessageRepository')),
    __metadata("design:paramtypes", [Object, Object])
], MarkChatReadUseCase);
