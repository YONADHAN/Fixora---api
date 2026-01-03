"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetDefaultAddressRequestSchema = exports.SetDefaultAddressBasicSchema = void 0;
const zod_1 = require("zod");
exports.SetDefaultAddressBasicSchema = zod_1.z.object({
    addressId: zod_1.z.string().trim().min(1, 'addressId is required'),
});
exports.SetDefaultAddressRequestSchema = zod_1.z.object({
    addressId: zod_1.z.string(),
});
