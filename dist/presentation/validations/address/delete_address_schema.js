"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAddressRequestSchema = exports.DeleteAddressBasicSchema = void 0;
const zod_1 = require("zod");
exports.DeleteAddressBasicSchema = zod_1.z.object({
    addressId: zod_1.z.string().trim().min(1, 'addressId is required'),
});
exports.DeleteAddressRequestSchema = zod_1.z.object({
    addressId: zod_1.z.string(),
});
