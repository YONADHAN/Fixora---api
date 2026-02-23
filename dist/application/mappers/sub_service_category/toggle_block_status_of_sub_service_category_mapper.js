"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleBlockStatusOfSubServiceCategoryRequestMapper = void 0;
class toggleBlockStatusOfSubServiceCategoryRequestMapper {
    static toDTO({ params, }) {
        return {
            subServiceCategoryId: params.subServiceCategoryId,
            blockStatus: params.blockStatus,
        };
    }
}
exports.toggleBlockStatusOfSubServiceCategoryRequestMapper = toggleBlockStatusOfSubServiceCategoryRequestMapper;
