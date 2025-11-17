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
exports.AdminForgotPasswordStrategy = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../../../domain/utils/custom.error");
const constants_1 = require("../../../../shared/constants");
let AdminForgotPasswordStrategy = class AdminForgotPasswordStrategy {
    constructor(repo, emailService, tokenService, redisRepo) {
        this.repo = repo;
        this.emailService = emailService;
        this.tokenService = tokenService;
        this.redisRepo = redisRepo;
    }
    async execute(email) {
        const user = await this.repo.findOne({ email });
        if (!user) {
            throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.EMAIL_NOT_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
        }
        const resetToken = this.tokenService.generateResetToken(email);
        await this.redisRepo.storeResetToken(user.userId ?? '', resetToken);
        const resetUrl = `${process.env.NEXT_FRONTEND_URL}/admin/reset-password/${resetToken}`;
        await this.emailService.sendResetEmail(email, 'Reset Password', resetUrl);
    }
};
exports.AdminForgotPasswordStrategy = AdminForgotPasswordStrategy;
exports.AdminForgotPasswordStrategy = AdminForgotPasswordStrategy = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IAdminRepository')),
    __param(1, (0, tsyringe_1.inject)('IEmailService')),
    __param(2, (0, tsyringe_1.inject)('ITokenService')),
    __param(3, (0, tsyringe_1.inject)('IRedisTokenRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], AdminForgotPasswordStrategy);
