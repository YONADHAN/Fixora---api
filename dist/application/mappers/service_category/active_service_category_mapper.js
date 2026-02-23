"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveServiceCategoryMapper = void 0;
class ActiveServiceCategoryMapper {
    static toDTO(service_categories) {
        const active_service_categories = [];
        for (let i = 0; i < service_categories.length; i++) {
            if (service_categories[i].isActive === true) {
                const filtered_service_category = {
                    serviceCategoryId: service_categories[i].serviceCategoryId,
                    name: service_categories[i].name,
                    description: service_categories[i].description,
                    bannerImage: service_categories[i].bannerImage,
                };
                active_service_categories.push(filtered_service_category);
            }
        }
        return {
            data: active_service_categories,
        };
    }
}
exports.ActiveServiceCategoryMapper = ActiveServiceCategoryMapper;
