"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetVendorSubServiceCategoriesResponseMapper = exports.GetVendorSubServiceCategoriesRequestMapper = void 0;
class GetVendorSubServiceCategoriesRequestMapper {
    static toDTO({ query, }) {
        return {
            vendorId: query.vendorId,
            page: Number(query.page),
            limit: Number(query.limit),
            search: query.search || '',
        };
    }
}
exports.GetVendorSubServiceCategoriesRequestMapper = GetVendorSubServiceCategoriesRequestMapper;
class GetVendorSubServiceCategoriesResponseMapper {
    static toDTO(response) {
        var _a, _b;
        let filteredServiceData = [];
        for (let i = 0; i < response.data.length; i++) {
            let document = response.data[i];
            const filteredDoc = {
                subServiceCategoryId: document.subServiceCategoryId,
                serviceCategoryId: ((_a = document.serviceCategory) === null || _a === void 0 ? void 0 : _a.serviceCategoryId) || '',
                serviceCategoryName: ((_b = document.serviceCategory) === null || _b === void 0 ? void 0 : _b.name) || '',
                name: document.name,
                description: document.description,
                bannerImage: document.bannerImage,
                isActive: document.isActive,
                verification: document.verification,
            };
            filteredServiceData.push(filteredDoc);
        }
        return {
            data: filteredServiceData,
            currentPage: response.currentPage,
            totalPages: response.totalPages,
        };
    }
}
exports.GetVendorSubServiceCategoriesResponseMapper = GetVendorSubServiceCategoriesResponseMapper;
