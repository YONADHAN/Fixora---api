"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllSubServiceCategoriesResponseMapper = exports.GetAllSubServiceCategoriesRequestMapper = void 0;
class GetAllSubServiceCategoriesRequestMapper {
    static toDTO({ page, limit, search, }) {
        return {
            page: Number(page),
            limit: Number(limit),
            search: search.trim(),
        };
    }
}
exports.GetAllSubServiceCategoriesRequestMapper = GetAllSubServiceCategoriesRequestMapper;
class GetAllSubServiceCategoriesResponseMapper {
    static toDTO({ data, currentPage, totalPages, }) {
        var _a, _b;
        const subServiceCategories = [];
        for (let i = 0; i < data.length; i++) {
            const rawItem = data[i];
            const item = {
                subServiceCategoryId: rawItem.subServiceCategoryId,
                serviceCategoryId: ((_a = rawItem.serviceCategory) === null || _a === void 0 ? void 0 : _a.serviceCategoryId) || '',
                serviceCategoryName: ((_b = rawItem.serviceCategory) === null || _b === void 0 ? void 0 : _b.name) || '',
                name: rawItem.name,
                description: rawItem.description,
                bannerImage: rawItem.bannerImage,
                isActive: rawItem.isActive,
                verification: rawItem.verification,
            };
            subServiceCategories.push(item);
        }
        return {
            data: subServiceCategories,
            currentPage,
            totalPages,
        };
    }
}
exports.GetAllSubServiceCategoriesResponseMapper = GetAllSubServiceCategoriesResponseMapper;
