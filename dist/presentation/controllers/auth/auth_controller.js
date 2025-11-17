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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const tsyringe_1 = require("tsyringe");
require("reflect-metadata");
const constants_1 = require("../../../shared/constants");
const error_handler_1 = require("../../../shared/utils/error_handler");
const otp_mail_validation_schema_1 = require("./validations/otp_mail_validation_schema");
const user_signup_validation_schema_1 = require("./validations/user_signup_validation_schema");
const cookie_helper_1 = require("../../../shared/utils/cookie_helper");
const user_login_validation_schema_1 = require("./validations/user_login_validation_schema");
const forgot_password_validation_schema_1 = require("./validations/forgot_password_validation_schema");
const reset_password_validation_schema_1 = require("./validations/reset_password_validation_schema");
let AuthController = class AuthController {
    constructor(_sendOtpEmailUseCase, _verifyOtpUseCase, _registerUserUseCase, _generateTokenUseCase, _loginUserUseCase, _forgotPasswordUseCase, _resetPasswordUseCase, _revokeRefreshTokenUseCase, _blacklistTokenUseCase, _refreshTokenUseCase, _googleLoginUseCase, _changeMyPasswordUsecase) {
        this._sendOtpEmailUseCase = _sendOtpEmailUseCase;
        this._verifyOtpUseCase = _verifyOtpUseCase;
        this._registerUserUseCase = _registerUserUseCase;
        this._generateTokenUseCase = _generateTokenUseCase;
        this._loginUserUseCase = _loginUserUseCase;
        this._forgotPasswordUseCase = _forgotPasswordUseCase;
        this._resetPasswordUseCase = _resetPasswordUseCase;
        this._revokeRefreshTokenUseCase = _revokeRefreshTokenUseCase;
        this._blacklistTokenUseCase = _blacklistTokenUseCase;
        this._refreshTokenUseCase = _refreshTokenUseCase;
        this._googleLoginUseCase = _googleLoginUseCase;
        this._changeMyPasswordUsecase = _changeMyPasswordUsecase;
    }
    // controller for sending otp to emails
    // giving email as parameter
    async sendOtpEmail(req, res) {
        try {
            const { email } = req.body;
            await this._sendOtpEmailUseCase.execute(email);
            res.status(constants_1.HTTP_STATUS.OK).json({
                message: constants_1.SUCCESS_MESSAGES.OTP_SEND_SUCCESS,
                success: true,
            });
        }
        catch (error) {
            (0, error_handler_1.handleErrorResponse)(req, res, error);
        }
    }
    //controller for verifying otp
    //giving email and otp as parameters
    async verifyOtp(req, res) {
        try {
            const { email, otp } = req.body;
            const validatedData = otp_mail_validation_schema_1.otpMailValidationSchema.parse({ email, otp });
            await this._verifyOtpUseCase.execute(validatedData);
            res.status(constants_1.HTTP_STATUS.OK).json({
                message: constants_1.SUCCESS_MESSAGES.VERIFICATION_SUCCESS,
                success: true,
            });
        }
        catch (error) {
            (0, error_handler_1.handleErrorResponse)(req, res, error);
        }
    }
    //controller for registering the users
    //giving the user data + role in body
    async register(req, res) {
        try {
            const { role } = req.body;
            const schema = user_signup_validation_schema_1.userSchema[role];
            if (!schema) {
                res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: constants_1.ERROR_MESSAGES.INVALID_CREDENTIALS,
                });
                return;
            }
            //console.log('schema failed')
            const validatedData = schema.parse(req.body);
            await this._registerUserUseCase.execute(validatedData);
            res.status(constants_1.HTTP_STATUS.CREATED).json({
                success: true,
                message: constants_1.SUCCESS_MESSAGES.REGISTRATION_SUCCESS,
            });
        }
        catch (error) {
            (0, error_handler_1.handleErrorResponse)(req, res, error);
        }
    }
    //controller for make the users login
    //giving the email,password and role in body
    async login(req, res) {
        try {
            const data = req.body;
            const validatedData = user_login_validation_schema_1.loginSchema.parse(data);
            if (!validatedData) {
                res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: constants_1.ERROR_MESSAGES.INVALID_CREDENTIALS,
                });
                return;
            }
            const user = await this._loginUserUseCase.execute(validatedData);
            if (!user.userId || !user.email || !user.role) {
                throw new Error('User ID, email, or role is missing');
            }
            const tokens = await this._generateTokenUseCase.execute(user.userId, user.email, user.role);
            const accessTokenName = `${user.role}_access_token`;
            const refreshTokenName = `${user.role}_refresh_token`;
            (0, cookie_helper_1.setAuthCookies)(res, tokens.accessToken, tokens.refreshToken, accessTokenName, refreshTokenName);
            // const { password, ...userWithoutPassword } = user
            delete user.password;
            res.status(constants_1.HTTP_STATUS.OK).json({
                success: true,
                message: constants_1.SUCCESS_MESSAGES.LOGIN_SUCCESS,
                user,
            });
        }
        catch (error) {
            (0, error_handler_1.handleErrorResponse)(req, res, error);
        }
    }
    //controller for users to click the forgot password
    //giving email and role in body
    async forgotPassword(req, res) {
        try {
            const validatedData = forgot_password_validation_schema_1.forgotPasswordValidationSchema.parse(req.body);
            if (!validatedData) {
                res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: constants_1.ERROR_MESSAGES.VALIDATION_ERROR,
                });
                return;
            }
            await this._forgotPasswordUseCase.execute(validatedData);
            res.status(constants_1.HTTP_STATUS.OK).json({
                success: true,
                message: constants_1.SUCCESS_MESSAGES.EMAIL_SENT_SUCCESSFULLY,
            });
        }
        catch (error) {
            (0, error_handler_1.handleErrorResponse)(req, res, error);
        }
    }
    //controller for reseting the password
    //giving token as parameter
    async resetPassword(req, res) {
        try {
            const validatedData = reset_password_validation_schema_1.resetPasswordValidationSchema.parse(req.body);
            if (!validatedData) {
                res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: constants_1.ERROR_MESSAGES.VALIDATION_ERROR,
                });
            }
            await this._resetPasswordUseCase.execute(validatedData);
            res.status(constants_1.HTTP_STATUS.OK).json({
                success: true,
                message: constants_1.SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS,
            });
        }
        catch (error) {
            (0, error_handler_1.handleErrorResponse)(req, res, error);
        }
    }
    async logout(req, res) {
        try {
            await this._blacklistTokenUseCase.execute(req.user.access_token);
            await this._revokeRefreshTokenUseCase.execute(req.user.refresh_token);
            const user = req.user;
            const accessTokenName = `${user.role}_access_token`;
            const refreshTokenName = `${user.role}_refresh_token`;
            (0, cookie_helper_1.clearAuthCookies)(res, accessTokenName, refreshTokenName);
            res
                .status(constants_1.HTTP_STATUS.OK)
                .json({ success: true, message: constants_1.SUCCESS_MESSAGES.USER_LOGOUT_SUCCESS });
        }
        catch (error) {
            (0, error_handler_1.handleErrorResponse)(req, res, error);
        }
    }
    async handleTokenRefresh(req, res) {
        try {
            const token = req.user.refresh_token;
            const newToken = this._refreshTokenUseCase.execute(token);
            const access_token_name = `${newToken.role}_access_token`;
            (0, cookie_helper_1.updateCookieWithAccessToken)(res, newToken.accessToken, access_token_name);
            res.status(constants_1.HTTP_STATUS.OK).json({
                success: true,
                message: constants_1.SUCCESS_MESSAGES.REFRESH_TOKEN_REFRESHED_SUCCESS,
                token: newToken.accessToken,
            });
        }
        catch (error) {
            (0, error_handler_1.handleErrorResponse)(req, res, error);
        }
    }
    async authenticateWithGoogle(req, res) {
        try {
            const { credential, client_id, role } = req.body;
            const user = await this._googleLoginUseCase.execute(credential, client_id, role);
            if (!user.userId || !user.email || !user.role) {
                throw new Error('User ID, email or role is missing');
            }
            const tokens = await this._generateTokenUseCase.execute(user.userId, user.email, user.role);
            const accessTokenName = `${user.role}_access_token`;
            const refreshTokenName = `${user.role}_refresh_token`;
            (0, cookie_helper_1.setAuthCookies)(res, tokens.accessToken, tokens.refreshToken, accessTokenName, refreshTokenName);
            res.status(constants_1.HTTP_STATUS.OK).json({
                success: true,
                message: constants_1.SUCCESS_MESSAGES.LOGIN_SUCCESS,
                user: user,
            });
        }
        catch (error) {
            console.error(' Google Auth Error:', error);
            (0, error_handler_1.handleErrorResponse)(req, res, error);
        }
    }
    async changeMyPassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            const userId = req.user.userId;
            const role = req.user.role;
            console.log('current', currentPassword);
            console.log('new', newPassword);
            console.log('userId', userId);
            console.log('role', role);
            if (currentPassword.trim() === newPassword.trim()) {
                res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: constants_1.ERROR_MESSAGES.SAME_CURR_NEW_PASSWORD,
                });
                return;
            }
            await this._changeMyPasswordUsecase.execute(currentPassword, newPassword, userId, role);
            console.log('successfully changed');
            res.status(constants_1.HTTP_STATUS.OK).json({
                success: true,
                message: constants_1.SUCCESS_MESSAGES.PASSWORD_CHANGED_SUCCESSFULLY,
            });
        }
        catch (error) {
            (0, error_handler_1.handleErrorResponse)(req, res, error);
        }
    }
};
exports.AuthController = AuthController;
exports.AuthController = AuthController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('ISendOtpEmailUseCase')),
    __param(1, (0, tsyringe_1.inject)('IVerifyOtpUseCase')),
    __param(2, (0, tsyringe_1.inject)('IRegisterUserUseCase')),
    __param(3, (0, tsyringe_1.inject)('IGenerateTokenUseCase')),
    __param(4, (0, tsyringe_1.inject)('ILoginUserUseCase')),
    __param(5, (0, tsyringe_1.inject)('IForgotPasswordUseCase')),
    __param(6, (0, tsyringe_1.inject)('IResetPasswordUseCase')),
    __param(7, (0, tsyringe_1.inject)('IRevokeRefreshTokenUseCase')),
    __param(8, (0, tsyringe_1.inject)('IBlacklistTokenUseCase')),
    __param(9, (0, tsyringe_1.inject)('IRefreshTokenUseCase')),
    __param(10, (0, tsyringe_1.inject)('IGoogleUseCase')),
    __param(11, (0, tsyringe_1.inject)('IChangeMyPasswordUseCase')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object])
], AuthController);
