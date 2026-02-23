"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordValidationSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const email_validation_1 = require("../../../../shared/validations/email_validation");
const constants_1 = require("../../../../shared/constants");
exports.forgotPasswordValidationSchema = zod_1.default.object({
    email: email_validation_1.strongEmailRegex,
    role: zod_1.default.enum(['customer', 'admin', 'vendor'], {
        message: constants_1.ERROR_MESSAGES.INVALID_ROLE,
    }),
});
