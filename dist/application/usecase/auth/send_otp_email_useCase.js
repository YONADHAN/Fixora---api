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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpEmailUseCase = void 0;
const custom_error_1 = require("../../../domain/utils/custom.error");
const constants_1 = require("../../../shared/constants");
const tsyringe_1 = require("tsyringe");
const chalk_1 = __importDefault(require("chalk"));
let sendOtpEmailUseCase = class sendOtpEmailUseCase {
    constructor(_otpService, _userExistenceService, _otpBcrypt, _emailService) {
        this._otpService = _otpService;
        this._userExistenceService = _userExistenceService;
        this._otpBcrypt = _otpBcrypt;
        this._emailService = _emailService;
    }
    async execute(email) {
        const emailExists = await this._userExistenceService.emailExists(email);
        if (emailExists) {
            throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.EMAIL_EXISTS, constants_1.HTTP_STATUS.CONFLICT);
        }
        const otp = this._otpService.generateOtp();
        console.log(chalk_1.default.yellowBright.bold(`OTP:`), chalk_1.default.bgGreenBright.bold(otp));
        const hashedOtp = await this._otpBcrypt.hash(otp);
        await this._otpService.storeOtp(email, hashedOtp);
        await this._emailService.sendOtpEmail(email, 'Fixora - verify your Email', otp);
    }
};
exports.sendOtpEmailUseCase = sendOtpEmailUseCase;
exports.sendOtpEmailUseCase = sendOtpEmailUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IOtpService')),
    __param(1, (0, tsyringe_1.inject)('IUserExistenceService')),
    __param(2, (0, tsyringe_1.inject)('IOtpBcrypt')),
    __param(3, (0, tsyringe_1.inject)('IEmailService')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], sendOtpEmailUseCase);
