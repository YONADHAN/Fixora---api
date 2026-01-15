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
exports.GetChatMessagesUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../../domain/utils/custom.error");
let GetChatMessagesUseCase = class GetChatMessagesUseCase {
    constructor(_chatRepository, _messageRepository) {
        this._chatRepository = _chatRepository;
        this._messageRepository = _messageRepository;
    }
    execute(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { chatId, requesterId, requesterRole, page = 1, limit = 20 } = input;
            const chat = yield this._chatRepository.findByChatId(chatId);
            if (!chat) {
                throw new custom_error_1.CustomError('Chat not found', 404);
            }
            const isCustomer = requesterRole === 'customer' && chat.customerId === requesterId;
            const isVendor = requesterRole === 'vendor' && chat.vendorId === requesterId;
            if (!isCustomer && !isVendor) {
                throw new custom_error_1.CustomError('You are not allowed to view this chat', 403);
            }
            const result = yield this._messageRepository.findMessagesByChatId(chatId, page, limit);
            return {
                messages: result.data,
                currentPage: result.currentPage,
                totalPages: result.totalPages,
            };
        });
    }
};
exports.GetChatMessagesUseCase = GetChatMessagesUseCase;
exports.GetChatMessagesUseCase = GetChatMessagesUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IChatRepository')),
    __param(1, (0, tsyringe_1.inject)('IMessageRepository')),
    __metadata("design:paramtypes", [Object, Object])
], GetChatMessagesUseCase);
