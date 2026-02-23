"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const email_validation_1 = require("../../../../shared/validations/email_validation");
const password_validation_1 = require("../../../../shared/validations/password_validation");
exports.loginSchema = zod_1.default.object({
    email: email_validation_1.strongEmailRegex,
    password: password_validation_1.passwordSchema,
    role: zod_1.default.enum(['admin', 'customer', 'vendor']),
});
