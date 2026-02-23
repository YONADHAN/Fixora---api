"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerModel = void 0;
const mongoose_1 = require("mongoose");
const customer_schema_1 = require("../schemas/customer_schema");
exports.CustomerModel = (0, mongoose_1.model)('Customer', customer_schema_1.customerSchema);
