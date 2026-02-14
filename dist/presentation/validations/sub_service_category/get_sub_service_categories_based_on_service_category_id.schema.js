"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllSubServiceCategoriesBasedOnServiceCategoryIdZodValidationSchema = void 0;
const zod_1 = require("zod");
exports.GetAllSubServiceCategoriesBasedOnServiceCategoryIdZodValidationSchema = zod_1.z.object({
    query: zod_1.z.object({
        serviceCategoryId: zod_1.z.string(),
        page: zod_1.z.string(),
        limit: zod_1.z.string(),
        search: zod_1.z.string(),
    }),
});
