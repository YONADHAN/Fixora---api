"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateServiceRequestMapper = void 0;
const create_service_schema_1 = require("../../../presentation/validations/service/create_service.schema");
class CreateServiceRequestMapper {
    static toDTO({ rawData, files }) {
        var _a, _b, _c, _d, _e;
        // ------------------------------
        // 1. Parse JSON
        // ------------------------------
        const parsedServiceVariants = rawData.serviceVariants
            ? JSON.parse(rawData.serviceVariants)
            : [];
        const parsedPricing = rawData.pricing ? JSON.parse(rawData.pricing) : {};
        const parsedSchedule = rawData.schedule ? JSON.parse(rawData.schedule) : {};
        // ------------------------------
        // 2. VALIDATE NESTED STRUCTURES
        // ------------------------------
        create_service_schema_1.createServiceNestedZodSchemaForServiceVariants.parse(parsedServiceVariants);
        create_service_schema_1.createServiceNestedZodSchemaForPricing.parse(parsedPricing);
        create_service_schema_1.createServiceNestedZodSchemaForSchedule.parse(parsedSchedule);
        // ------------------------------
        // 3. Convert fields
        // ------------------------------
        const dailyWorkingWindows = parsedSchedule.dailyWorkingWindows || [];
        const weeklyWorkingDays = ((_a = parsedSchedule.weeklyWorkingDays) === null || _a === void 0 ? void 0 : _a.map(Number)) || [];
        const monthlyWorkingDates = ((_b = parsedSchedule.monthlyWorkingDates) === null || _b === void 0 ? void 0 : _b.map(Number)) || [];
        const overrideBlock = ((_c = parsedSchedule.overrideBlock) === null || _c === void 0 ? void 0 : _c.map((b) => {
            var _a;
            return ({
                startDateTime: new Date(b.startDateTime),
                endDateTime: new Date(b.endDateTime),
                reason: (_a = b.reason) !== null && _a !== void 0 ? _a : '',
            });
        })) || [];
        const overrideCustom = ((_d = parsedSchedule.overrideCustom) === null || _d === void 0 ? void 0 : _d.map((c) => ({
            startDateTime: new Date(c.startDateTime),
            endDateTime: new Date(c.endDateTime),
            startTime: c.startTime,
            endTime: c.endTime,
        }))) || [];
        // ------------------------------
        // 4. Main Image
        // ------------------------------
        const mainImage = (files === null || files === void 0 ? void 0 : files[0]) || null;
        // ------------------------------
        // 5. Final DTO
        // ------------------------------
        return {
            vendorId: rawData.vendorId,
            subServiceCategoryId: rawData.subServiceCategoryId,
            name: rawData.name,
            description: (_e = rawData.description) !== null && _e !== void 0 ? _e : '',
            serviceVariants: parsedServiceVariants,
            pricing: {
                pricePerSlot: Number(parsedPricing.pricePerSlot),
                advanceAmountPerSlot: Number(parsedPricing.advanceAmountPerSlot),
            },
            mainImage,
            schedule: {
                visibilityStartDate: new Date(parsedSchedule.visibilityStartDate),
                visibilityEndDate: new Date(parsedSchedule.visibilityEndDate),
                dailyWorkingWindows,
                slotDurationMinutes: Number(parsedSchedule.slotDurationMinutes),
                recurrenceType: parsedSchedule.recurrenceType,
                weeklyWorkingDays,
                monthlyWorkingDates,
                overrideBlock,
                overrideCustom,
            },
            isActiveStatusByVendor: true,
            isActiveStatusByAdmin: true,
            adminStatusNote: '',
        };
    }
}
exports.CreateServiceRequestMapper = CreateServiceRequestMapper;
