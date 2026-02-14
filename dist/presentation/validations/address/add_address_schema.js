"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddAddressRequestSchema = exports.AddAddressBasicSchema = void 0;
const zod_1 = require("zod");
exports.AddAddressBasicSchema = zod_1.z.object({
    customerId: zod_1.z.string().trim().min(1, 'customerId is required'),
    label: zod_1.z.string().trim().min(1, 'label is required'),
    addressType: zod_1.z.enum(['home', 'office', 'other']),
    contactName: zod_1.z.string().trim().optional(),
    contactPhone: zod_1.z.string().trim().optional(),
    addressLine1: zod_1.z.string().trim().min(1, 'addressLine1 is required'),
    addressLine2: zod_1.z.string().trim().optional(),
    landmark: zod_1.z.string().trim().optional(),
    city: zod_1.z.string().trim().optional(),
    state: zod_1.z.string().trim().optional(),
    country: zod_1.z.string().trim().optional(),
    zipCode: zod_1.z.string().trim().optional(),
    instructions: zod_1.z.string().trim().optional(),
    latitude: zod_1.z.string().trim().min(1, 'latitude is required'),
    longitude: zod_1.z.string().trim().min(1, 'longitude is required'),
    isDefault: zod_1.z.boolean().optional(),
});
exports.AddAddressRequestSchema = zod_1.z.object({
    customerId: zod_1.z.string(),
    label: zod_1.z.string(),
    addressType: zod_1.z.enum(['home', 'office', 'other']),
    isDefault: zod_1.z.boolean().optional().default(false),
    contactName: zod_1.z.string().optional(),
    contactPhone: zod_1.z.string().optional(),
    addressLine1: zod_1.z.string(),
    addressLine2: zod_1.z.string().optional(),
    landmark: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
    zipCode: zod_1.z.string().optional(),
    instructions: zod_1.z.string().optional(),
    geoLocation: zod_1.z.object({
        type: zod_1.z.literal('Point'),
        coordinates: zod_1.z.tuple([zod_1.z.number(), zod_1.z.number()]), // [lng, lat]
    }),
    location: zod_1.z
        .object({
        name: zod_1.z.string().optional(),
        displayName: zod_1.z.string().optional(),
    })
        .optional(),
});
