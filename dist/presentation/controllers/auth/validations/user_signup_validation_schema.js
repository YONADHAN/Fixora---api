"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = exports.customerSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const email_validation_1 = require("../../../../shared/validations/email_validation");
const phone_validation_1 = require("../../../../shared/validations/phone_validation");
const password_validation_1 = require("../../../../shared/validations/password_validation");
const name_validation_1 = require("../../../../shared/validations/name_validation");
const adminSchema = zod_1.default.object({
    email: email_validation_1.strongEmailRegex,
    password: password_validation_1.passwordSchema,
    phone: phone_validation_1.phoneNumberSchema,
    name: name_validation_1.nameSchema,
    role: zod_1.default.literal('admin'),
});
exports.customerSchema = zod_1.default.object({
    name: name_validation_1.nameSchema,
    email: email_validation_1.strongEmailRegex,
    phone: phone_validation_1.phoneNumberSchema.optional(),
    password: password_validation_1.passwordSchema.optional(),
    role: zod_1.default.literal('customer'),
    googleId: zod_1.default.string().optional(),
    geoLocation: zod_1.default
        .object({
        type: zod_1.default.literal('Point'),
        coordinates: zod_1.default.array(zod_1.default.number()),
    })
        .optional(),
    location: zod_1.default
        .object({
        name: zod_1.default.string(),
        displayName: zod_1.default.string(),
        zipCode: zod_1.default.string(),
    })
        .optional(),
});
const vendorSchema = zod_1.default.object({
    name: name_validation_1.nameSchema,
    email: email_validation_1.strongEmailRegex,
    phone: phone_validation_1.phoneNumberSchema.optional(),
    password: password_validation_1.passwordSchema.optional(),
    role: zod_1.default.literal('vendor'),
    googleId: zod_1.default.string().optional(),
    geoLocation: zod_1.default
        .object({
        type: zod_1.default.literal('Point'),
        coordinates: zod_1.default.array(zod_1.default.number()),
    })
        .optional(),
    location: zod_1.default
        .object({
        name: zod_1.default.string(),
        displayName: zod_1.default.string(),
        zipCode: zod_1.default.string(),
    })
        .optional(),
});
exports.userSchema = {
    admin: adminSchema,
    customer: exports.customerSchema,
    vendor: vendorSchema,
};
