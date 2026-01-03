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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchServicesForCustomersUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const search_services_for_customer_mapper_1 = require("../../mappers/service/search_services_for_customer_mapper");
const custom_error_1 = require("../../../domain/utils/custom.error");
const constants_1 = require("../../../shared/constants");
let SearchServicesForCustomersUseCase = class SearchServicesForCustomersUseCase {
    constructor(_serviceRepository, _subServiceCategoryRepo) {
        this._serviceRepository = _serviceRepository;
        this._subServiceCategoryRepo = _subServiceCategoryRepo;
    }
    execute(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const filter = {
                isActiveStatusByAdmin: true,
                isActiveStatusByVendor: true,
            };
            const subCategory = yield this._subServiceCategoryRepo.findOne({
                subServiceCategoryId: dto.subServiceCategoryId,
            });
            if (!subCategory) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.INVALID_CREDENTIALS, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            filter.subServiceCategoryRef = subCategory._id;
            // PRICE FILTER
            if (dto.minPrice || dto.maxPrice) {
                filter['pricing.pricePerSlot'] = {};
                if (dto.minPrice)
                    filter['pricing.pricePerSlot'].$gte = dto.minPrice;
                if (dto.maxPrice)
                    filter['pricing.pricePerSlot'].$lte = dto.maxPrice;
            }
            // RECURRENCE FILTER
            if (dto.recurrenceType) {
                filter['schedule.recurrenceType'] = dto.recurrenceType;
            }
            // WEEKLY DAYS FILTER
            if ((_a = dto.weeklyDays) === null || _a === void 0 ? void 0 : _a.length) {
                filter['schedule.weeklyWorkingDays'] = { $in: dto.weeklyDays };
            }
            // AVAILABLE DATE FILTER (visibilityStartDate → visibilityEndDate)
            if (dto.availableFrom && dto.availableTo) {
                filter['schedule.visibilityStartDate'] = { $lte: dto.availableFrom };
                filter['schedule.visibilityEndDate'] = { $gte: dto.availableTo };
            }
            // WORKING HOURS FILTER — MUST USE $elemMatch ❗❗
            if (dto.workStartTime && dto.workEndTime) {
                filter['schedule.dailyWorkingWindows'] = {
                    $elemMatch: {
                        startTime: { $lte: dto.workStartTime },
                        endTime: { $gte: dto.workEndTime },
                    },
                };
            }
            //  SEARCH IS NOT ADDED HERE because repository handles it already.
            const response = yield this._serviceRepository.findAllDocumentsWithFilterationAndPopulate(dto.page, dto.limit, dto.search, filter, ['subServiceCategoryRef', 'vendorRef']);
            return search_services_for_customer_mapper_1.SearchServicesForCustomersResponseMapper.toDTO(response);
        });
    }
};
exports.SearchServicesForCustomersUseCase = SearchServicesForCustomersUseCase;
exports.SearchServicesForCustomersUseCase = SearchServicesForCustomersUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IServiceRepository')),
    __param(1, (0, tsyringe_1.inject)('ISubServiceCategoryRepository')),
    __metadata("design:paramtypes", [Object, Object])
], SearchServicesForCustomersUseCase);
