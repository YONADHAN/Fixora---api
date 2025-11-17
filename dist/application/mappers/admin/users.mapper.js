"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
class UserMapper {
    static toResponse(users) {
        return users.map((user) => ({
            userId: user.userId?.toString() ?? '',
            name: user.name ?? '',
            email: user.email ?? '',
            role: user.role ?? 'customer',
            status: user.status,
            // isBlocked: user.status === 'blocked',
            createdAt: user.createdAt ?? new Date(),
            updatedAt: user.updatedAt,
        }));
    }
}
exports.UserMapper = UserMapper;
