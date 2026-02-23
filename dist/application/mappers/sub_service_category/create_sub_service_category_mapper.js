"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSubServiceCategoryResponseMapper = exports.CreateSubServiceCategoryRequestMapper = void 0;
class CreateSubServiceCategoryRequestMapper {
    static toDTO({ body, file, createdById, createdByRole, isActive, }) {
        return {
            name: body.name,
            description: body.description,
            serviceCategoryId: body.serviceCategoryId,
            bannerImage: file,
            createdById,
            createdByRole,
            isActive,
        };
    }
}
exports.CreateSubServiceCategoryRequestMapper = CreateSubServiceCategoryRequestMapper;
class CreateSubServiceCategoryResponseMapper {
    static toDTO(payload) {
        var _a, _b;
        const populated = payload.serviceCategory;
        return {
            name: payload.name,
            description: payload.description,
            serviceCategoryId: (_a = populated === null || populated === void 0 ? void 0 : populated.serviceCategoryId) !== null && _a !== void 0 ? _a : '',
            serviceCategoryName: (_b = populated === null || populated === void 0 ? void 0 : populated.name) !== null && _b !== void 0 ? _b : '',
            subServiceCategoryId: payload.subServiceCategoryId,
            bannerImage: payload.bannerImage,
        };
    }
}
exports.CreateSubServiceCategoryResponseMapper = CreateSubServiceCategoryResponseMapper;
