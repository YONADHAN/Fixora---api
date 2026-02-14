"use strict";
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
exports.registerSocketEvents = void 0;
const tsyringe_1 = require("tsyringe");
const constants_1 = require("../../shared/constants");
const registerSocketEvents = (socket) => {
    const markReadUseCase = tsyringe_1.container.resolve('IMarkNotificationReadUseCase');
    const sendMessageUseCase = tsyringe_1.container.resolve('ISendMessageUseCase');
    const markChatReadUseCase = tsyringe_1.container.resolve('IMarkChatReadUseCase');
    const markAllReadUseCase = tsyringe_1.container.resolve('IMarkAllNotificationsReadUseCase');
    /* -------------------- NOTIFICATIONS -------------------- */
    socket.on(constants_1.SOCKET_EVENTS.NOTIFICATION_READ, (notificationId, ack) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield markReadUseCase.execute(notificationId, socket.data.user.userId);
            ack === null || ack === void 0 ? void 0 : ack({ success: true });
        }
        catch (error) {
            ack === null || ack === void 0 ? void 0 : ack({ success: false });
        }
    }));
    socket.on(constants_1.SOCKET_EVENTS.NOTIFICATION_READ_ALL, (ack) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield markAllReadUseCase.execute(socket.data.user.userId);
            ack === null || ack === void 0 ? void 0 : ack({ success: true });
        }
        catch (error) {
            ack === null || ack === void 0 ? void 0 : ack({ success: false });
        }
    }));
    /* -------------------- CHAT  -------------------- */
    socket.on(constants_1.SOCKET_EVENTS.CHAT_JOIN, (roomId) => {
        socket.join(`chat:${roomId}`);
    });
    socket.on(constants_1.SOCKET_EVENTS.CHAT_LEAVE, (roomId) => {
        socket.leave(`chat:${roomId}`);
    });
    socket.on(constants_1.SOCKET_EVENTS.CHAT_SEND, (payload, ack) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const user = socket.data.user;
            //  Role guard (fixes TS + security)
            if (user.role !== 'customer' && user.role !== 'vendor') {
                ack === null || ack === void 0 ? void 0 : ack({
                    success: false,
                    message: 'Admins are not allowed to send chat messages',
                });
                return;
            }
            const { message, chat } = yield sendMessageUseCase.execute({
                chatId: payload.chatId,
                senderId: user.userId,
                senderRole: user.role,
                content: payload.content,
                messageType: payload.messageType,
                replyTo: payload.replyTo,
                booking: payload.booking,
            });
            socket
                .to(`chat:${payload.chatId}`)
                .emit(constants_1.SOCKET_EVENTS.CHAT_NEW, message);
            socket.emit(constants_1.SOCKET_EVENTS.CHAT_NEW, message);
            /* --------------------  REAL-TIME LIST UPDATE -------------------- */
            const receiverId = user.role === 'customer' ? (_a = chat.vendor) === null || _a === void 0 ? void 0 : _a.userId : (_b = chat.customer) === null || _b === void 0 ? void 0 : _b.userId;
            socket.to(`user:${receiverId}`).emit(constants_1.SOCKET_EVENTS.CHAT_LIST_UPDATE, Object.assign(Object.assign({}, chat), { chatId: chat.chatId, lastMessage: chat.lastMessage, unreadCount: chat.unreadCount }));
            ack === null || ack === void 0 ? void 0 : ack({
                success: true,
                data: message,
            });
        }
        catch (error) {
            ack === null || ack === void 0 ? void 0 : ack({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to send message',
            });
        }
    }));
    /* -------------------- PRESENCE -------------------- */
    socket.on(constants_1.SOCKET_EVENTS.PRESENCE_PING, () => {
        socket.emit('presence:pong');
    });
    socket.on(constants_1.SOCKET_EVENTS.CHAT_READ, (chatId, ack) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = socket.data.user;
            //  Only chat participants can mark read
            if (user.role !== 'customer' && user.role !== 'vendor') {
                ack === null || ack === void 0 ? void 0 : ack({ success: false });
                return;
            }
            yield markChatReadUseCase.execute({
                chatId,
                readerId: user.userId,
                readerRole: user.role,
            });
            //  Optional: notify other participant
            socket.to(`chat:${chatId}`).emit('chat:read:update', {
                chatId,
                readerId: user.userId,
            });
            ack === null || ack === void 0 ? void 0 : ack({ success: true });
        }
        catch (_a) {
            ack === null || ack === void 0 ? void 0 : ack({ success: false });
        }
    }));
    /*--------------------TYPING------------------*/
    socket.on(constants_1.SOCKET_EVENTS.CHAT_TYPING_START, ({ chatId }) => {
        socket.to(`chat:${chatId}`).emit(constants_1.SOCKET_EVENTS.CHAT_TYPING_START, {
            userId: socket.data.user.userId,
        });
    });
    socket.on(constants_1.SOCKET_EVENTS.CHAT_TYPING_STOP, ({ chatId }) => {
        socket.to(`chat:${chatId}`).emit(constants_1.SOCKET_EVENTS.CHAT_TYPING_STOP, {
            userId: socket.data.user.userId,
        });
    });
};
exports.registerSocketEvents = registerSocketEvents;
