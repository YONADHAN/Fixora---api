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
exports.GetAllSubServiceCategoriesBasedOnServiceCategoryId = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../../domain/utils/custom.error");
const constants_1 = require("../../../shared/constants");
const get_sub_service_catergories_based_on_service_category_mapper_1 = require("../../mappers/sub_service_category/get_sub_service_catergories_based_on_service_category_mapper");
const mongoose_1 = require("mongoose");
let GetAllSubServiceCategoriesBasedOnServiceCategoryId = class GetAllSubServiceCategoriesBasedOnServiceCategoryId {
    constructor(_subServiceCategoryRepository, _serviceCategoryRepository) {
        this._subServiceCategoryRepository = _subServiceCategoryRepository;
        this._serviceCategoryRepository = _serviceCategoryRepository;
    }
    execute(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log('Entering the usecase', payload.serviceCategoryId)
            const serviceCategoryExists = yield this._serviceCategoryRepository.findOne({
                serviceCategoryId: payload.serviceCategoryId,
            });
            if (!serviceCategoryExists) {
                throw new custom_error_1.CustomError('Service Category Id Is Not Valid', constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            const page = payload.page;
            const limit = payload.limit;
            const search = payload.search;
            //console.log('The payload :', payload)
            const serviceCategoryRef = new mongoose_1.Types.ObjectId(serviceCategoryExists._id);
            const response = yield this._subServiceCategoryRepository.findAllDocumentsWithFilteration(page, limit, search !== null && search !== void 0 ? search : '', { serviceCategoryRef });
            //console.log("doesn't have error in this saving data ", response)
            return get_sub_service_catergories_based_on_service_category_mapper_1.GetAllSubServiceCategoriesBasedOnServiceCategoryIdResponseMapper.toDTO(response);
        });
    }
};
exports.GetAllSubServiceCategoriesBasedOnServiceCategoryId = GetAllSubServiceCategoriesBasedOnServiceCategoryId;
exports.GetAllSubServiceCategoriesBasedOnServiceCategoryId = GetAllSubServiceCategoriesBasedOnServiceCategoryId = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('ISubServiceCategoryRepository')),
    __param(1, (0, tsyringe_1.inject)('IServiceCategoryRepository')),
    __metadata("design:paramtypes", [Object, Object])
], GetAllSubServiceCategoriesBasedOnServiceCategoryId);
