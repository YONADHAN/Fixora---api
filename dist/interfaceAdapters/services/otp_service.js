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
exports.OtpService = void 0;
const config_1 = require("../../shared/config");
const tsyringe_1 = require("tsyringe");
let OtpService = class OtpService {
    constructor(_otpRepository, _otpBcrypt) {
        this._otpRepository = _otpRepository;
        this._otpBcrypt = _otpBcrypt;
    }
    generateOtp() {
        return Math.floor(Math.random() * 9000 + 1000).toString();
    }
    async storeOtp(email, otp) {
        const expiresAt = new Date(Date.now() + parseInt(config_1.config.OtpExpiry) * 60 * 1000);
        await this._otpRepository.save({ email, otp, expiresAt });
    }
    async verifyOtp(email, otp) {
        const otpEntry = await this._otpRepository.findLatestOtp(email);
        if (!otpEntry)
            return false;
        if (new Date() > otpEntry.expiresAt ||
            !(await this._otpBcrypt.compare(otp, otpEntry.otp))) {
            return false;
        }
        await this._otpRepository.delete({ email });
        return true;
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IOtpRepository')),
    __param(1, (0, tsyringe_1.inject)('IOtpBcrypt')),
    __metadata("design:paramtypes", [Object, Object])
], OtpService);
