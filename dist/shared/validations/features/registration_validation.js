"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationSchema = void 0;
const zod_1 = require("zod");
const password_validation_1 = require("../password_validation");
const strongEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
exports.RegistrationSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .regex(strongEmailRegex, { message: 'Invalid email format' })
        .trim(),
    password: password_validation_1.passwordSchema,
});
