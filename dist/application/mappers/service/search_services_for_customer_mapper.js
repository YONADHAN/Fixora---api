"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchServicesForCustomersResponseMapper = exports.RequestSearchServicesForCustomerRequestMapper = void 0;
class RequestSearchServicesForCustomerRequestMapper {
    static toDTO(validated) {
        const minPrice = validated.minPrice ? Number(validated.minPrice) : undefined;
        const maxPrice = validated.maxPrice ? Number(validated.maxPrice) : undefined;
        const page = Math.max(1, Number(validated.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(validated.limit) || 10));
        const result = {
            subServiceCategoryId: validated.subServiceCategoryId.trim(),
            search: validated.search.trim(),
            minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
            maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
            availableFrom: validated.availableFrom
                ? new Date(validated.availableFrom)
                : undefined,
            availableTo: validated.availableTo
                ? new Date(validated.availableTo)
                : undefined,
            workStartTime: validated.workStartTime,
            workEndTime: validated.workEndTime,
            recurrenceType: validated.recurrenceType,
            weeklyDays: validated.weeklyDays
                ? validated.weeklyDays
                    .split(',')
                    .map(Number)
                    .filter((n) => Number.isInteger(n) && n >= 0 && n <= 6)
                : undefined,
            page,
            limit,
        };
        return result;
    }
}
exports.RequestSearchServicesForCustomerRequestMapper = RequestSearchServicesForCustomerRequestMapper;
class SearchServicesForCustomersResponseMapper {
    static toDTO(response) {
        return {
            data: response.data.map((item) => {
                var _a, _b, _c, _d, _e, _f, _g;
                return ({
                    serviceId: item.serviceId,
                    name: item.name,
                    description: (_a = item.description) !== null && _a !== void 0 ? _a : '',
                    serviceVariants: (_c = (_b = item.serviceVariants) === null || _b === void 0 ? void 0 : _b.map((v) => {
                        var _a, _b;
                        return ({
                            name: v.name,
                            description: (_a = v.description) !== null && _a !== void 0 ? _a : '',
                            price: (_b = v.price) !== null && _b !== void 0 ? _b : 0,
                        });
                    })) !== null && _c !== void 0 ? _c : [],
                    pricing: item.pricing,
                    mainImage: item.mainImage,
                    schedule: item.schedule,
                    vendor: (_e = (_d = item.populatedValues) === null || _d === void 0 ? void 0 : _d.vendor) !== null && _e !== void 0 ? _e : null,
                    subServiceCategory: (_g = (_f = item.populatedValues) === null || _f === void 0 ? void 0 : _f.subServiceCategory) !== null && _g !== void 0 ? _g : null,
                });
            }),
            totalPages: response.totalPages,
            currentPage: response.currentPage,
        };
    }
}
exports.SearchServicesForCustomersResponseMapper = SearchServicesForCustomersResponseMapper;
