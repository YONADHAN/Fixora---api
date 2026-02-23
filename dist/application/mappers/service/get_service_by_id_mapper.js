"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetServiceByIdResponseMapper = exports.GetServiceByIdRequestMapper = void 0;
class GetServiceByIdRequestMapper {
    static toDTO(validated) {
        return {
            serviceId: validated.params.serviceId,
        };
    }
}
exports.GetServiceByIdRequestMapper = GetServiceByIdRequestMapper;
class GetServiceByIdResponseMapper {
    static toDTO(entity) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        return {
            serviceId: entity.serviceId,
            vendorId: (_c = (_b = (_a = entity.populatedValues) === null || _a === void 0 ? void 0 : _a.vendor) === null || _b === void 0 ? void 0 : _b.userId) !== null && _c !== void 0 ? _c : '',
            subServiceCategoryId: (_f = (_e = (_d = entity.populatedValues) === null || _d === void 0 ? void 0 : _d.subServiceCategory) === null || _e === void 0 ? void 0 : _e.subServiceCategoryId) !== null && _f !== void 0 ? _f : '',
            name: entity.name,
            description: entity.description,
            serviceVariants: (_g = entity.serviceVariants) !== null && _g !== void 0 ? _g : [],
            pricing: {
                pricePerSlot: entity.pricing.pricePerSlot,
                advanceAmountPerSlot: entity.pricing.advanceAmountPerSlot,
            },
            mainImage: entity.mainImage,
            isActiveStatusByVendor: entity.isActiveStatusByVendor,
            isActiveStatusByAdmin: entity.isActiveStatusByAdmin,
            adminStatusNote: entity.adminStatusNote,
            schedule: {
                visibilityStartDate: entity.schedule.visibilityStartDate,
                visibilityEndDate: entity.schedule.visibilityEndDate,
                dailyWorkingWindows: (_h = entity.schedule.dailyWorkingWindows) !== null && _h !== void 0 ? _h : [],
                slotDurationMinutes: entity.schedule.slotDurationMinutes,
                recurrenceType: entity.schedule.recurrenceType,
                weeklyWorkingDays: (_j = entity.schedule.weeklyWorkingDays) !== null && _j !== void 0 ? _j : [],
                monthlyWorkingDates: (_k = entity.schedule.monthlyWorkingDates) !== null && _k !== void 0 ? _k : [],
                overrideBlock: (_l = entity.schedule.overrideBlock) !== null && _l !== void 0 ? _l : [],
                overrideCustom: (_m = entity.schedule.overrideCustom) !== null && _m !== void 0 ? _m : [],
            },
            populatedValues: {
                vendor: ((_o = entity.populatedValues) === null || _o === void 0 ? void 0 : _o.vendor)
                    ? {
                        name: entity.populatedValues.vendor.name,
                        userId: entity.populatedValues.vendor.userId,
                        profileImage: entity.populatedValues.vendor.profileImage,
                    }
                    : undefined,
                subServiceCategory: ((_p = entity.populatedValues) === null || _p === void 0 ? void 0 : _p.subServiceCategory)
                    ? {
                        subServiceCategoryId: entity.populatedValues.subServiceCategory.subServiceCategoryId,
                        name: entity.populatedValues.subServiceCategory.name,
                        isActive: entity.populatedValues.subServiceCategory.isActive,
                    }
                    : undefined,
            },
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
exports.GetServiceByIdResponseMapper = GetServiceByIdResponseMapper;
