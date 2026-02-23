"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditAddressRequestSchema = exports.EditAddressBasicSchema = void 0;
const zod_1 = require("zod");
exports.EditAddressBasicSchema = zod_1.z.object({
    addressId: zod_1.z.string().trim().min(1, 'addressId is required'),
    label: zod_1.z.string().trim().optional(),
    addressType: zod_1.z.enum(['home', 'office', 'other']).optional(),
    contactName: zod_1.z.string().trim().optional(),
    contactPhone: zod_1.z.string().trim().optional(),
    addressLine1: zod_1.z.string().trim().optional(),
    addressLine2: zod_1.z.string().trim().optional(),
    landmark: zod_1.z.string().trim().optional(),
    city: zod_1.z.string().trim().optional(),
    state: zod_1.z.string().trim().optional(),
    country: zod_1.z.string().trim().optional(),
    zipCode: zod_1.z.string().trim().optional(),
    instructions: zod_1.z.string().trim().optional(),
    latitude: zod_1.z.string().trim().optional(),
    longitude: zod_1.z.string().trim().optional(),
    isDefault: zod_1.z.boolean().optional(),
    isActive: zod_1.z.boolean().optional(),
});
exports.EditAddressRequestSchema = zod_1.z.object({
    addressId: zod_1.z.string(),
    label: zod_1.z.string().optional(),
    addressType: zod_1.z.enum(['home', 'office', 'other']).optional(),
    isDefault: zod_1.z.boolean().optional(),
    isActive: zod_1.z.boolean().optional(),
    contactName: zod_1.z.string().optional(),
    contactPhone: zod_1.z.string().optional(),
    addressLine1: zod_1.z.string().optional(),
    addressLine2: zod_1.z.string().optional(),
    landmark: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
    zipCode: zod_1.z.string().optional(),
    instructions: zod_1.z.string().optional(),
    geoLocation: zod_1.z
        .object({
        type: zod_1.z.literal('Point'),
        coordinates: zod_1.z.tuple([zod_1.z.number(), zod_1.z.number()]),
    })
        .optional(),
});
