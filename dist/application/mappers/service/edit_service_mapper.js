"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditServiceRequestMapper = void 0;
class EditServiceRequestMapper {
    static toDTO(payload) {
        var _a, _b;
        const mainImage = (_a = payload.files) === null || _a === void 0 ? void 0 : _a[0];
        return {
            serviceId: payload.serviceId,
            vendorId: payload.vendorId,
            subServiceCategoryId: payload.subServiceCategoryId,
            name: payload.name,
            description: (_b = payload.description) !== null && _b !== void 0 ? _b : '',
            pricing: {
                pricePerSlot: Number(payload['pricing.pricePerSlot']),
                advanceAmountPerSlot: Number(payload['pricing.advanceAmountPerSlot']),
            },
            mainImage,
            schedule: {
                visibilityStartDate: new Date(payload['schedule.visibilityStartDate']),
                visibilityEndDate: new Date(payload['schedule.visibilityEndDate']),
                dailyWorkingWindows: [
                    {
                        startTime: payload['schedule.dailyWorkingWindows[0].startTime'],
                        endTime: payload['schedule.dailyWorkingWindows[0].endTime'],
                    },
                ],
                slotDurationMinutes: Number(payload['schedule.slotDurationMinutes']),
                recurrenceType: payload['schedule.recurrenceType'],
                weeklyWorkingDays: [],
                monthlyWorkingDates: [],
                overrideBlock: [],
                overrideCustom: [],
            },
        };
    }
}
exports.EditServiceRequestMapper = EditServiceRequestMapper;
