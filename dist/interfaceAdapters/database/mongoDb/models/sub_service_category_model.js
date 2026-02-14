"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubServiceCategoryModel = void 0;
const mongoose_1 = require("mongoose");
const sub_service_category_schema_1 = require("../schemas/sub_service_category_schema");
exports.SubServiceCategoryModel = (0, mongoose_1.model)('SubServiceCategory', sub_service_category_schema_1.subServiceCategorySchema);
