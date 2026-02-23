"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toServiceCategoryDTO = void 0;
const toServiceCategoryDTO = (entity) => {
    return {
        serviceCategoryId: entity.serviceCategoryId,
        name: entity.name,
        description: entity.description,
        bannerImage: entity.bannerImage,
        isActive: entity.isActive,
    };
};
exports.toServiceCategoryDTO = toServiceCategoryDTO;
