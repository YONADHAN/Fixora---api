"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRooms = void 0;
const registerRooms = (socket) => {
    const { user } = socket.data;
    if (!(user === null || user === void 0 ? void 0 : user.userId))
        return;
    socket.join(`user:${user.userId}`);
    socket.join(`role:${user.role}`);
    console.log(`Socket ${socket.id} joined rooms: user:${user.userId}, role:${user.role}`);
};
exports.registerRooms = registerRooms;
