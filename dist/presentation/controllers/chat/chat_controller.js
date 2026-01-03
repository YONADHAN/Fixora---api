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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const tsyringe_1 = require("tsyringe");
let ChatController = class ChatController {
    constructor(getChatMessagesUseCase, initiateChatUseCase, getUserChatsUseCase) {
        this.getChatMessagesUseCase = getChatMessagesUseCase;
        this.initiateChatUseCase = initiateChatUseCase;
        this.getUserChatsUseCase = getUserChatsUseCase;
    }
    getChatMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { chatId } = req.params;
            const { page = '1', limit = '20' } = req.query;
            const user = req.user;
            const result = yield this.getChatMessagesUseCase.execute({
                chatId,
                requesterId: user.userId,
                requesterRole: user.role,
                page: Number(page),
                limit: Number(limit),
            });
            res.status(200).json({
                success: true,
                data: result,
            });
        });
    }
    initiateChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { bookingId } = req.body;
            const user = req.user;
            const chatId = yield this.initiateChatUseCase.execute({
                bookingId,
                requesterId: user.userId,
                requesterRole: user.role,
            });
            res.status(201).json({
                success: true,
                message: 'Chat initiated successfully',
                data: { chatId },
            });
        });
    }
    getUserChats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const chats = yield this.getUserChatsUseCase.execute(user.userId);
            res.status(200).json({
                success: true,
                data: chats,
            });
        });
    }
};
exports.ChatController = ChatController;
exports.ChatController = ChatController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IGetChatMessagesUseCase')),
    __param(1, (0, tsyringe_1.inject)('IInitiateChatUseCase')),
    __param(2, (0, tsyringe_1.inject)('IGetUserChatsUseCase')),
    __metadata("design:paramtypes", [Object, typeof (_a = typeof IInitiateChatUseCase !== "undefined" && IInitiateChatUseCase) === "function" ? _a : Object, typeof (_b = typeof IGetUserChatsUseCase !== "undefined" && IGetUserChatsUseCase) === "function" ? _b : Object])
], ChatController);
