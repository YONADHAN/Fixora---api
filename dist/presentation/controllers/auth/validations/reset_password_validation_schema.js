"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordValidationSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const constants_1 = require("../../../../shared/constants");
const password_validation_1 = require("../../../../shared/validations/password_validation");
exports.resetPasswordValidationSchema = zod_1.default.object({
    password: password_validation_1.passwordSchema,
    token: zod_1.default.string(),
    role: zod_1.default.enum(['customer', 'admin', 'vendor'], {
        message: constants_1.ERROR_MESSAGES.INVALID_ROLE,
    }),
});
