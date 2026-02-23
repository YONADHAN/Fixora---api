"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressModel = void 0;
const mongoose_1 = require("mongoose");
const address_schema_1 = require("../schemas/address_schema");
exports.AddressModel = (0, mongoose_1.model)('Address', address_schema_1.AddressSchema);
