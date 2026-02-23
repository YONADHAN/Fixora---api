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
exports.EditSubServiceCategoryUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../../domain/utils/custom.error");
const constants_1 = require("../../../shared/constants");
const config_1 = require("../../../shared/config");
const edit_sub_service_category_mapper_1 = require("../../mappers/sub_service_category/edit_sub_service_category_mapper");
let EditSubServiceCategoryUseCase = class EditSubServiceCategoryUseCase {
    constructor(_storageService, _subServiceCategoryRepository, _serviceCategoryExists) {
        this._storageService = _storageService;
        this._subServiceCategoryRepository = _subServiceCategoryRepository;
        this._serviceCategoryExists = _serviceCategoryExists;
    }
    execute(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { subServiceCategoryId, name, description, serviceCategoryId, bannerImage, } = payload;
            //console.log('Payload is ', payload)
            const SubServiceCategoryExists = yield this._subServiceCategoryRepository.findOne({ subServiceCategoryId });
            if (!SubServiceCategoryExists) {
                throw new custom_error_1.CustomError('Sub Service Category Not Found', constants_1.HTTP_STATUS.NOT_FOUND);
            }
            const serviceCategoryExists = yield this._serviceCategoryExists.findOne({
                serviceCategoryId,
            });
            if (!serviceCategoryExists) {
                throw new custom_error_1.CustomError('Service Category is Invalid', constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            // console.log(
            //   'SubServiceCategoryExists with _id',
            //   SubServiceCategoryExists._id,
            //   ' AND ServiceCategory with _id : ',
            //   serviceCategoryExists._id
            // )
            const serviceCategoryRef = serviceCategoryExists._id;
            const bannerImageUrl = yield this._storageService.uploadFile(config_1.config.storageConfig.bucket, bannerImage, constants_1.S3_BUCKET_IMAGE_FOLDERS.SUB_SERVICE_CATEGORY_IMAGES);
            const data = {
                name,
                description,
                serviceCategoryId,
                serviceCategoryRef,
                bannerImage: bannerImageUrl,
            };
            // console.log('data', data)
            yield this._subServiceCategoryRepository.update({ subServiceCategoryId }, data);
            const subServiceCategory = yield this._subServiceCategoryRepository.findOneAndPopulate({ subServiceCategoryId }, 'serviceCategoryRef');
            if (!subServiceCategory) {
                throw new custom_error_1.CustomError('Sub-service category not found', constants_1.HTTP_STATUS.NOT_FOUND);
            }
            // console.log('response', subServiceCategory)
            return edit_sub_service_category_mapper_1.EditSubServiceCategoryResponseMapper.toDTO(subServiceCategory);
        });
    }
};
exports.EditSubServiceCategoryUseCase = EditSubServiceCategoryUseCase;
exports.EditSubServiceCategoryUseCase = EditSubServiceCategoryUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IStorageService')),
    __param(1, (0, tsyringe_1.inject)('ISubServiceCategoryRepository')),
    __param(2, (0, tsyringe_1.inject)('IServiceCategoryRepository')),
    __metadata("design:paramtypes", [Object, Object, Object])
], EditSubServiceCategoryUseCase);
