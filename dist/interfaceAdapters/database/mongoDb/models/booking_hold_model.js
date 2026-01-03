"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingHoldModel = void 0;
const mongoose_1 = require("mongoose");
const booking_hold_schema_1 = require("../schemas/booking_hold_schema");
exports.BookingHoldModel = (0, mongoose_1.model)('BookingHold', booking_hold_schema_1.BookingHoldSchema);
