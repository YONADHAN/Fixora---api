"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSocketServer = void 0;
const socket_io_1 = require("socket.io");
const chalk_1 = __importDefault(require("chalk"));
const socket_auth_1 = require("./socket.auth");
const socket_room_1 = require("./socket.room");
const socket_events_1 = require("./socket.events");
let io;
const initSocketServer = (httpServer) => {
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: process.env.NEXT_FRONTEND_URL,
            credentials: true,
        },
    });
    io.use(socket_auth_1.socketAuthMiddleware);
    io.on('connection', (socket) => {
        (0, socket_room_1.registerRooms)(socket);
        (0, socket_events_1.registerSocketEvents)(socket);
        console.log(chalk_1.default.cyanBright('🔌 Socket connected:'), chalk_1.default.white(socket.id));
    });
    console.log(chalk_1.default.greenBright.bold('⚡ Socket.IO server initialized and ready'));
    return io;
};
exports.initSocketServer = initSocketServer;
const getIO = () => {
    if (!io)
        throw new Error('Socket.io not initialized');
    return io;
};
exports.getIO = getIO;
