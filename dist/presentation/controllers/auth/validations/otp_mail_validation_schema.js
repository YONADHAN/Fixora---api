"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpMailValidationSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const email_validation_1 = require("../../../../shared/validations/email_validation");
exports.otpMailValidationSchema = zod_1.default.object({
    email: email_validation_1.strongEmailRegex,
    otp: zod_1.default
        .string()
        .length(4, 'OTP must be exactly 4 digits')
        .regex(/^\d{4}$/, 'OTP must contain only numbers'),
});
