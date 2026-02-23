"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchCustomerServicesDTOSchema = exports.SearchCustomerServicesBasicSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.SearchCustomerServicesBasicSchema = zod_1.default.object({
    subServiceCategoryId: zod_1.default.string().trim().min(1),
    search: zod_1.default.string().trim().default(''),
    minPrice: zod_1.default.string().optional(),
    maxPrice: zod_1.default.string().optional(),
    availableFrom: zod_1.default.string().optional(),
    availableTo: zod_1.default.string().optional(),
    workStartTime: zod_1.default.string().optional(),
    workEndTime: zod_1.default.string().optional(),
    recurrenceType: zod_1.default.enum(['daily', 'weekly', 'monthly']).optional(),
    weeklyDays: zod_1.default.string().optional(), // "1,3,5"
    page: zod_1.default.string().default('1'),
    limit: zod_1.default.string().default('10'),
});
exports.SearchCustomerServicesDTOSchema = zod_1.default.object({
    subServiceCategoryId: zod_1.default.string(),
    search: zod_1.default.string(),
    minPrice: zod_1.default.number().min(0).optional(),
    maxPrice: zod_1.default.number().min(0).optional(),
    availableFrom: zod_1.default.date().optional(),
    availableTo: zod_1.default.date().optional(),
    workStartTime: zod_1.default
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .optional(),
    workEndTime: zod_1.default
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .optional(),
    recurrenceType: zod_1.default.enum(['daily', 'weekly', 'monthly']).optional(),
    weeklyDays: zod_1.default.array(zod_1.default.number().int().min(0).max(6)).optional(),
    page: zod_1.default.number().int().min(1),
    limit: zod_1.default.number().int().min(1).max(100),
});
