"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditSubServiceCategoryResponseMapper = exports.EditSubServiceCategoryRequestMapper = void 0;
class EditSubServiceCategoryRequestMapper {
    static toDTO({ body, file, }) {
        return {
            name: body.name,
            description: body.description,
            serviceCategoryId: body.serviceCategoryId,
            subServiceCategoryId: body.subServiceCategoryId,
            bannerImage: file,
        };
    }
}
exports.EditSubServiceCategoryRequestMapper = EditSubServiceCategoryRequestMapper;
class EditSubServiceCategoryResponseMapper {
    static toDTO(payload) {
        var _a, _b;
        return {
            name: payload.name,
            description: payload.description,
            serviceCategoryId: ((_a = payload.serviceCategory) === null || _a === void 0 ? void 0 : _a.serviceCategoryId) || '',
            serviceCategoryName: ((_b = payload.serviceCategory) === null || _b === void 0 ? void 0 : _b.name) || '',
            subServiceCategoryId: payload.subServiceCategoryId,
            bannerImage: payload.bannerImage,
        };
    }
}
exports.EditSubServiceCategoryResponseMapper = EditSubServiceCategoryResponseMapper;
