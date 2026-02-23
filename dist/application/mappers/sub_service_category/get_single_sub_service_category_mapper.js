"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSingleSubServiceCategoryResponseMapper = exports.GetSingleSubServiceCategoryRequestMapper = void 0;
class GetSingleSubServiceCategoryRequestMapper {
    static toDTO({ params }) {
        return params.subServiceCategoryId;
    }
}
exports.GetSingleSubServiceCategoryRequestMapper = GetSingleSubServiceCategoryRequestMapper;
class GetSingleSubServiceCategoryResponseMapper {
    static toDTO(payload) {
        var _a, _b, _c, _d;
        return {
            name: payload.name,
            subServiceCategoryId: payload.subServiceCategoryId,
            description: payload.description,
            serviceCategoryId: ((_a = payload.serviceCategory) === null || _a === void 0 ? void 0 : _a.serviceCategoryId) || '',
            serviceCategoryName: ((_b = payload.serviceCategory) === null || _b === void 0 ? void 0 : _b.name) || '',
            bannerImage: payload.bannerImage,
            isActive: payload.isActive,
            verification: payload.verification,
            createdById: payload.createdById,
            createdByRole: payload.createdByRole,
            createdAt: (_c = payload.createdAt) !== null && _c !== void 0 ? _c : new Date(),
            updatedAt: (_d = payload.updatedAt) !== null && _d !== void 0 ? _d : new Date(),
        };
    }
}
exports.GetSingleSubServiceCategoryResponseMapper = GetSingleSubServiceCategoryResponseMapper;
