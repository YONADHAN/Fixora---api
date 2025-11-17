"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceModel = void 0;
const mongoose_1 = require("mongoose");
const service_schema_1 = require("../schemas/service_schema");
exports.ServiceModel = (0, mongoose_1.model)('Service', service_schema_1.serviceSchema);
