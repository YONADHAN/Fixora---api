"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceHistoryModel = void 0;
const mongoose_1 = require("mongoose");
const service_history_schema_1 = require("../schemas/service_history_schema");
exports.ServiceHistoryModel = (0, mongoose_1.model)('ServiceHistory', service_history_schema_1.ServiceHistorySchema);
