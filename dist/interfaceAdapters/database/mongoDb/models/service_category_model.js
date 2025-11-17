"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceCategoryModel = void 0;
const mongoose_1 = require("mongoose");
const service_category_schema_1 = require("../schemas/service_category_schema");
exports.ServiceCategoryModel = (0, mongoose_1.model)('ServiceCategory', service_category_schema_1.serviceCategorySchema);
