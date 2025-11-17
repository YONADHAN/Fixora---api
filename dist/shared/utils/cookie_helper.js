"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAuthCookies = exports.updateCookieWithAccessToken = exports.setAuthCookies = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const setAuthCookies = (res, accessToken, refreshToken, accessTokenName, refreshTokenName) => {
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie(accessTokenName, accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
    });
    res.cookie(refreshTokenName, refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
    });
};
exports.setAuthCookies = setAuthCookies;
const updateCookieWithAccessToken = (res, accessToken, accessTokenName) => {
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie(accessTokenName, accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        path: '/',
    });
};
exports.updateCookieWithAccessToken = updateCookieWithAccessToken;
// export const clearAuthCookies = (
//   res: Response,
//   accessTokenName: string,
//   refreshTokenName: string
// ) => {
//   res.clearCookie(accessTokenName)
//   res.clearCookie(refreshTokenName)
// }
const clearAuthCookies = (res, accessTokenName, refreshTokenName) => {
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie(accessTokenName, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        path: '/',
    });
    res.clearCookie(refreshTokenName, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        path: '/',
    });
};
exports.clearAuthCookies = clearAuthCookies;
