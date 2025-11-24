"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
class UserMapper {
    static toResponse(users) {
        return users.map((user) => {
            var _a, _b, _c, _d, _e, _f;
            return ({
                userId: (_b = (_a = user.userId) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '',
                name: (_c = user.name) !== null && _c !== void 0 ? _c : '',
                email: (_d = user.email) !== null && _d !== void 0 ? _d : '',
                role: (_e = user.role) !== null && _e !== void 0 ? _e : 'customer',
                status: user.status,
                // isBlocked: user.status === 'blocked',
                createdAt: (_f = user.createdAt) !== null && _f !== void 0 ? _f : new Date(),
                updatedAt: user.updatedAt,
            });
        });
    }
}
exports.UserMapper = UserMapper;
