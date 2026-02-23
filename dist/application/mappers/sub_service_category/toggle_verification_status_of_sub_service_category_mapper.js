"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleVerificationStatusOfSubServiceCategoryRequestMapper = void 0;
class ToggleVerificationStatusOfSubServiceCategoryRequestMapper {
    static toDTO({ payload, }) {
        return {
            subServiceCategoryId: payload.subServiceCategoryId,
            verificationStatus: payload.verificationStatus,
        };
    }
}
exports.ToggleVerificationStatusOfSubServiceCategoryRequestMapper = ToggleVerificationStatusOfSubServiceCategoryRequestMapper;
