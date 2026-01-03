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
exports.authorizeRole = exports.decodeToken = exports.verifyAuth = void 0;
const jwt_service_1 = require("../../interfaceAdapters/services/jwt_service");
const constants_1 = require("../../shared/constants");
const redis_client_1 = require("../../interfaceAdapters/repositories/redis/redis.client");
const cookie_helper_1 = require("../../shared/utils/cookie_helper");
const tokenService = new jwt_service_1.JWTService();
const roleMap = {
    customer: 'customer',
    admin: 'admin',
    vendor: 'vendor',
};
const extractToken = (req) => {
    const basePath = req.baseUrl.split('/');
    const userType = roleMap[basePath[3]];
    if (['customer', 'vendor', 'admin'].includes(userType)) {
        return {
            access_token: req.cookies[`${userType}_access_token`] || null,
            refresh_token: req.cookies[`${userType}_refresh_token`] || null,
        };
    }
    return null;
};
const isBlacklisted = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield redis_client_1.redisClient.get(token);
    // console.log('is token blacklisted', result)
    return result !== null;
});
const verifyAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = extractToken(req);
        if (!token) {
            res
                .status(constants_1.HTTP_STATUS.UNAUTHORIZED)
                .json({ message: constants_1.ERROR_MESSAGES.UNAUTHORIZED_ACCESS });
            return;
        }
        if (yield isBlacklisted(token.access_token)) {
            res
                .status(constants_1.HTTP_STATUS.UNAUTHORIZED)
                .json({ message: constants_1.ERROR_MESSAGES.TOKEN_BLACKLISTED });
            return;
        }
        const user = tokenService.verifyAccessToken(token.access_token);
        if (!user || !user.userId) {
            res
                .status(constants_1.HTTP_STATUS.UNAUTHORIZED)
                .json({ message: constants_1.ERROR_MESSAGES.UNAUTHORIZED_ACCESS });
            return;
        }
        ;
        req.user = Object.assign(Object.assign({}, user), { access_token: token.access_token, refresh_token: token.refresh_token });
        next();
    }
    catch (error) {
        res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
            message: constants_1.ERROR_MESSAGES.INVALID_TOKEN,
            statuscode: constants_1.HTTP_STATUS.UNAUTHORIZED,
        });
        return;
    }
});
exports.verifyAuth = verifyAuth;
const decodeToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log('entered the decode token')
        const token = extractToken(req);
        if (!(token === null || token === void 0 ? void 0 : token.refresh_token)) {
            // console.log('no token for decode')
            res
                .status(constants_1.HTTP_STATUS.UNAUTHORIZED)
                .json({ message: constants_1.ERROR_MESSAGES.UNAUTHORIZED_ACCESS });
            return;
        }
        // console.log('got the refresh token')
        const user = tokenService.verifyRefreshToken(token === null || token === void 0 ? void 0 : token.refresh_token);
        // console.log('got user data from verifying the refresh token', user)
        const newAccessToken = tokenService.generateAccessToken({
            userId: user.userId,
            email: user.email,
            role: user.role,
        });
        req.user = {
            userId: user === null || user === void 0 ? void 0 : user.userId,
            email: user === null || user === void 0 ? void 0 : user.email,
            role: user === null || user === void 0 ? void 0 : user.role,
            access_token: newAccessToken,
            refresh_token: token.refresh_token,
        };
        next();
    }
    catch (error) {
        // console.log('failed to decode', error)
        const basePath = req.baseUrl.split('/');
        const role = basePath[3];
        if (role) {
            const accessTokenName = `${role}_access_token`;
            const refreshTokenName = `${role}_refresh_token`;
            (0, cookie_helper_1.clearAuthCookies)(res, accessTokenName, refreshTokenName);
        }
        return res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
            message: constants_1.ERROR_MESSAGES.INVALID_TOKEN,
        });
    }
});
exports.decodeToken = decodeToken;
const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !allowedRoles.includes(user.role)) {
            res.status(constants_1.HTTP_STATUS.FORBIDDEN).json({
                message: constants_1.ERROR_MESSAGES.NOT_ALLOWED,
                user: user ? user.role : '',
            });
            return;
        }
        next();
    };
};
exports.authorizeRole = authorizeRole;
