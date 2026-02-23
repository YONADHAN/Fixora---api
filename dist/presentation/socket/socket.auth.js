"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketAuthMiddleware = void 0;
const cookie = __importStar(require("cookie"));
const jwt_service_1 = require("../../interfaceAdapters/services/jwt_service");
const custom_error_1 = require("../../domain/utils/custom.error");
const tokenService = new jwt_service_1.JWTService();
const socketAuthMiddleware = (socket, next) => {
    const transport = socket.conn.transport.name;
    const isRecovered = socket.recovered === true;
    console.log('\n🔐 SOCKET AUTH MIDDLEWARE');
    console.log('• socket.id   :', socket.id);
    console.log('• transport   :', transport);
    console.log('• recovered   :', isRecovered);
    try {
        const cookieHeader = socket.handshake.headers.cookie;
        console.log('• cookies present:', Boolean(cookieHeader));
        if (!cookieHeader) {
            console.log('⚠️  No cookies yet (initial handshake)');
            return next();
        }
        const cookies = cookie.parse(cookieHeader);
        const accessToken = cookies.customer_access_token ||
            cookies.vendor_access_token ||
            cookies.admin_access_token;
        const refreshToken = cookies.customer_refresh_token ||
            cookies.vendor_refresh_token ||
            cookies.admin_refresh_token;
        console.log('• access token present :', Boolean(accessToken));
        console.log('• refresh token present:', Boolean(refreshToken));
        if (accessToken) {
            const decoded = tokenService.verifyAccessToken(accessToken);
            if (!decoded || typeof decoded === 'string') {
                console.log('❌ Invalid access token');
                if (refreshToken) {
                    console.log('⚠️ Access token invalid, but Refresh token present. Allowing as guest.');
                    socket.data.user = null;
                    return next();
                }
                return next(new custom_error_1.CustomError('Invalid socket token', 401));
            }
            const payload = decoded;
            console.log('✅ Authenticated socket user:', payload.userId);
            socket.data.user = payload;
            socket.join(`user:${payload.userId}`);
            return next();
        }
        if (refreshToken) {
            console.log('⚠️  Refresh token present, waiting for re-auth');
            socket.data.user = null;
            return next();
        }
        console.log('⚠️  No tokens found, connecting as guest');
        socket.data.user = null;
        return next();
    }
    catch (error) {
        console.log('❌ Socket auth middleware error:', error);
        // Even on error, we might want to allow connection or fail safely
        return next(new custom_error_1.CustomError('Invalid socket token', 401));
    }
};
exports.socketAuthMiddleware = socketAuthMiddleware;
