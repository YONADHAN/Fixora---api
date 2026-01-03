"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetActiveSubServiceCategoriesResponseMapper = void 0;
class GetActiveSubServiceCategoriesResponseMapper {
    static toDTO(response) {
        const result = [];
        for (let i = 0; i < response.length; i++) {
            const item = {
                subServiceCategoryId: response[i].subServiceCategoryId,
                name: response[i].name,
            };
            result.push(item);
        }
        return result;
    }
}
exports.GetActiveSubServiceCategoriesResponseMapper = GetActiveSubServiceCategoriesResponseMapper;
