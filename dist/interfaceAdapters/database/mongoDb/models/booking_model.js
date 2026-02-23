"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingModel = void 0;
const mongoose_1 = require("mongoose");
const booking_schema_1 = require("../schemas/booking_schema");
exports.BookingModel = (0, mongoose_1.model)('Booking', booking_schema_1.BookingSchema);
