"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModel = void 0;
const mongoose_1 = require("mongoose");
const payment_schema_1 = require("../schemas/payment_schema");
exports.PaymentModel = (0, mongoose_1.model)('Payment', payment_schema_1.PaymentSchema);
