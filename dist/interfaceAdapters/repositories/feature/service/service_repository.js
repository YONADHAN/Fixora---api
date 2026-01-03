"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceRepository = void 0;
const tsyringe_1 = require("tsyringe");
const service_model_1 = require("../../../database/mongoDb/models/service_model");
const base_repository_1 = require("../../base_repository");
const mongoose_1 = require("mongoose");
function isVendorPopulated(ref) {
    return (ref &&
        typeof ref === 'object' &&
        '_id' in ref &&
        'name' in ref &&
        'userId' in ref);
}
function isSubCategoryPopulated(ref) {
    return (ref &&
        typeof ref === 'object' &&
        '_id' in ref &&
        'name' in ref &&
        'subServiceCategoryId' in ref);
}
let ServiceRepository = class ServiceRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(service_model_1.ServiceModel);
    }
    toModel(entity) {
        var _a, _b, _c;
        return {
            vendorRef: entity.vendorRef
                ? new mongoose_1.Types.ObjectId(entity.vendorRef)
                : undefined,
            subServiceCategoryRef: entity.subServiceCategoryRef
                ? new mongoose_1.Types.ObjectId(entity.subServiceCategoryRef)
                : undefined,
            serviceId: entity.serviceId,
            name: entity.name,
            description: entity.description,
            serviceVariants: entity.serviceVariants
                ? entity.serviceVariants.map((v) => ({
                    name: v.name,
                    description: v.description,
                    price: v.price,
                }))
                : [],
            pricing: entity.pricing
                ? {
                    pricePerSlot: entity.pricing.pricePerSlot,
                    advanceAmountPerSlot: entity.pricing.advanceAmountPerSlot,
                }
                : undefined,
            mainImage: entity.mainImage,
            isActiveStatusByAdmin: entity.isActiveStatusByAdmin,
            isActiveStatusByVendor: entity.isActiveStatusByVendor,
            adminStatusNote: entity.adminStatusNote,
            schedule: entity.schedule
                ? {
                    visibilityStartDate: entity.schedule.visibilityStartDate,
                    visibilityEndDate: entity.schedule.visibilityEndDate,
                    dailyWorkingWindows: (_a = entity.schedule.dailyWorkingWindows) === null || _a === void 0 ? void 0 : _a.map((w) => ({
                        startTime: w.startTime,
                        endTime: w.endTime,
                    })),
                    slotDurationMinutes: entity.schedule.slotDurationMinutes,
                    recurrenceType: entity.schedule.recurrenceType,
                    weeklyWorkingDays: entity.schedule.weeklyWorkingDays,
                    monthlyWorkingDates: entity.schedule.monthlyWorkingDates,
                    overrideBlock: (_b = entity.schedule.overrideBlock) === null || _b === void 0 ? void 0 : _b.map((b) => ({
                        startDateTime: b.startDateTime,
                        endDateTime: b.endDateTime,
                        reason: b.reason,
                    })),
                    overrideCustom: (_c = entity.schedule.overrideCustom) === null || _c === void 0 ? void 0 : _c.map((c) => ({
                        startDateTime: c.startDateTime,
                        endDateTime: c.endDateTime,
                        startTime: c.startTime,
                        endTime: c.endTime,
                    })),
                }
                : undefined,
        };
    }
    toEntity(model) {
        var _a, _b, _c, _d;
        const entity = {
            _id: model._id.toString(),
            serviceId: model.serviceId,
            vendorRef: model.vendorRef.toString(),
            subServiceCategoryRef: model.subServiceCategoryRef.toString(),
            name: model.name,
            description: model.description,
            serviceVariants: (_a = model.serviceVariants) === null || _a === void 0 ? void 0 : _a.map((v) => ({
                name: v.name,
                description: v.description,
                price: v.price,
            })),
            pricing: {
                pricePerSlot: model.pricing.pricePerSlot,
                advanceAmountPerSlot: model.pricing.advanceAmountPerSlot,
            },
            mainImage: model.mainImage,
            isActiveStatusByAdmin: model.isActiveStatusByAdmin,
            isActiveStatusByVendor: model.isActiveStatusByVendor,
            adminStatusNote: model.adminStatusNote,
            schedule: {
                visibilityStartDate: model.schedule.visibilityStartDate,
                visibilityEndDate: model.schedule.visibilityEndDate,
                dailyWorkingWindows: (_b = model.schedule.dailyWorkingWindows) === null || _b === void 0 ? void 0 : _b.map((w) => ({
                    startTime: w.startTime,
                    endTime: w.endTime,
                })),
                slotDurationMinutes: model.schedule.slotDurationMinutes,
                recurrenceType: model.schedule.recurrenceType,
                weeklyWorkingDays: model.schedule.weeklyWorkingDays,
                monthlyWorkingDates: model.schedule.monthlyWorkingDates,
                overrideBlock: (_c = model.schedule.overrideBlock) === null || _c === void 0 ? void 0 : _c.map((b) => ({
                    startDateTime: b.startDateTime,
                    endDateTime: b.endDateTime,
                    reason: b.reason,
                })),
                overrideCustom: (_d = model.schedule.overrideCustom) === null || _d === void 0 ? void 0 : _d.map((c) => ({
                    startDateTime: c.startDateTime,
                    endDateTime: c.endDateTime,
                    startTime: c.startTime,
                    endTime: c.endTime,
                })),
            },
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
        };
        // ----------------------------------------
        //        POPULATED VALUES HANDLING
        // ----------------------------------------
        entity.populatedValues = {};
        if (isVendorPopulated(model.vendorRef)) {
            entity.populatedValues.vendor = {
                name: model.vendorRef.name,
                userId: model.vendorRef.userId.toString(),
                profileImage: model.vendorRef.profileImage,
                geoLocation: model.vendorRef.geoLocation,
                location: model.vendorRef.location,
                status: model.vendorRef.status,
            };
        }
        if (isSubCategoryPopulated(model.subServiceCategoryRef)) {
            entity.populatedValues.subServiceCategory = {
                subServiceCategoryId: model.subServiceCategoryRef.subServiceCategoryId,
                name: model.subServiceCategoryRef.name,
                isActive: model.subServiceCategoryRef.isActive,
            };
        }
        return entity;
    }
};
exports.ServiceRepository = ServiceRepository;
exports.ServiceRepository = ServiceRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], ServiceRepository);
