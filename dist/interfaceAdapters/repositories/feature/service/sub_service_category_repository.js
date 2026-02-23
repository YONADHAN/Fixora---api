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
exports.SubServiceCategoryRepository = void 0;
const tsyringe_1 = require("tsyringe");
const sub_service_category_model_1 = require("../../../database/mongoDb/models/sub_service_category_model");
const base_repository_1 = require("../../base_repository");
const mongoose_1 = require("mongoose");
/* ------------------------------------------------------------------
   TYPE GUARD FUNCTION — PLACE IT ABOVE CLASS (BEST PRACTICE)
-------------------------------------------------------------------*/
function isPopulated(ref) {
    return (ref &&
        typeof ref === 'object' &&
        '_id' in ref &&
        'name' in ref &&
        'serviceCategoryId' in ref);
}
/* ------------------------------------------------------------------
   REPOSITORY CLASS
-------------------------------------------------------------------*/
let SubServiceCategoryRepository = class SubServiceCategoryRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(sub_service_category_model_1.SubServiceCategoryModel);
    }
    toEntity(model) {
        let serviceCategory = undefined;
        if (isPopulated(model.serviceCategoryRef)) {
            serviceCategory = {
                _id: model.serviceCategoryRef._id.toString(),
                name: model.serviceCategoryRef.name,
                serviceCategoryId: model.serviceCategoryRef.serviceCategoryId,
            };
        }
        return {
            _id: model._id,
            subServiceCategoryId: model.subServiceCategoryId,
            serviceCategoryRef: model.serviceCategoryRef.toString(),
            serviceCategory,
            name: model.name,
            description: model.description,
            bannerImage: model.bannerImage,
            isActive: model.isActive,
            verification: model.verification,
            createdById: model.createdById,
            createdByRole: model.createdByRole,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
        };
    }
    toModel(entity) {
        let serviceCategoryRef = undefined;
        if (entity.serviceCategoryRef) {
            if (typeof entity.serviceCategoryRef === 'string') {
                serviceCategoryRef = new mongoose_1.Types.ObjectId(entity.serviceCategoryRef);
            }
            else if (typeof entity.serviceCategoryRef === 'object') {
                serviceCategoryRef = undefined;
            }
        }
        return {
            subServiceCategoryId: entity.subServiceCategoryId,
            serviceCategoryRef,
            name: entity.name,
            description: entity.description,
            bannerImage: entity.bannerImage,
            isActive: entity.isActive,
            verification: entity.verification,
            createdById: entity.createdById,
            createdByRole: entity.createdByRole,
        };
    }
};
exports.SubServiceCategoryRepository = SubServiceCategoryRepository;
exports.SubServiceCategoryRepository = SubServiceCategoryRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], SubServiceCategoryRepository);
