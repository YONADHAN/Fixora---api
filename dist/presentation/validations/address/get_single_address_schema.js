"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSingleAddressSchema = void 0;
const zod_1 = require("zod");
exports.GetSingleAddressSchema = zod_1.z.object({
    addressId: zod_1.z.string().trim(),
});
