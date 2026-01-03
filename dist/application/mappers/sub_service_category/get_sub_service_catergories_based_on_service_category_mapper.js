"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllSubServiceCategoriesBasedOnServiceCategoryIdResponseMapper = exports.GetAllSubServiceCategoriesBasedOnServiceCategoryIdRequestMapper = void 0;
class GetAllSubServiceCategoriesBasedOnServiceCategoryIdRequestMapper {
    static toDTO({ query, }) {
        return {
            serviceCategoryId: query.serviceCategoryId,
            page: Number(query.page),
            limit: Number(query.limit),
            search: query.search,
        };
    }
}
exports.GetAllSubServiceCategoriesBasedOnServiceCategoryIdRequestMapper = GetAllSubServiceCategoriesBasedOnServiceCategoryIdRequestMapper;
class GetAllSubServiceCategoriesBasedOnServiceCategoryIdResponseMapper {
    static toDTO(response) {
        const result = [];
        for (let i = 0; i < response.data.length; i++) {
            const item = response.data[i];
            if (item.isActive === 'active' && item.verification === 'accepted') {
                const data = {
                    name: item.name,
                    subServiceCategoryId: item.subServiceCategoryId,
                    bannerImage: item.bannerImage,
                    description: item.description,
                };
                result.push(data);
            }
        }
        return {
            data: result,
            totalPages: response.totalPages,
            currentPage: response.currentPage,
        };
    }
}
exports.GetAllSubServiceCategoriesBasedOnServiceCategoryIdResponseMapper = GetAllSubServiceCategoriesBasedOnServiceCategoryIdResponseMapper;
