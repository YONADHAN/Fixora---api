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
        sameSite: 'lax',
    });
    res.cookie(refreshTokenName, refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
    });
};
exports.setAuthCookies = setAuthCookies;
const updateCookieWithAccessToken = (res, accessToken, accessTokenName) => {
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie(accessTokenName, accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
    });
};
exports.updateCookieWithAccessToken = updateCookieWithAccessToken;
const clearAuthCookies = (res, accessTokenName, refreshTokenName) => {
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie(accessTokenName, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
    });
    res.clearCookie(refreshTokenName, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
    });
};
exports.clearAuthCookies = clearAuthCookies;
// import { config } from 'dotenv'
// import { Response } from 'express'
// config()
// export const setAuthCookies = (
//   res: Response,
//   accessToken: string,
//   refreshToken: string,
//   accessTokenName: string,
//   refreshTokenName: string
// ) => {
//   const isProduction = process.env.NODE_ENV === 'production'
//   res.cookie(accessTokenName, accessToken, {
//     httpOnly: true,
//     secure: isProduction,
//     sameSite: 'strict',
//   })
//   res.cookie(refreshTokenName, refreshToken, {
//     httpOnly: true,
//     secure: isProduction,
//     sameSite: 'strict',
//   })
// }
// export const updateCookieWithAccessToken = (
//   res: Response,
//   accessToken: string,
//   accessTokenName: string
// ) => {
//   const isProduction = process.env.NODE_ENV === 'production'
//   res.cookie(accessTokenName, accessToken, {
//     httpOnly: true,
//     secure: isProduction,
//     sameSite: 'strict',
//     path: '/',
//   })
// }
// export const clearAuthCookies = (
//   res: Response,
//   accessTokenName: string,
//   refreshTokenName: string
// ) => {
//   const isProduction = process.env.NODE_ENV === 'production'
//   res.clearCookie(accessTokenName, {
//     httpOnly: true,
//     secure: isProduction,
//     sameSite: 'strict',
//     path: '/',
//   })
//   res.clearCookie(refreshTokenName, {
//     httpOnly: true,
//     secure: isProduction,
//     sameSite: 'strict',
//     path: '/',
//   })
// }
