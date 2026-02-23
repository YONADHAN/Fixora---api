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
exports.CreateSubServiceCategoryUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../../domain/utils/custom.error");
const constants_1 = require("../../../shared/constants");
const config_1 = require("../../../shared/config");
const crypto_1 = require("crypto");
const create_sub_service_category_mapper_1 = require("../../mappers/sub_service_category/create_sub_service_category_mapper");
let CreateSubServiceCategoryUseCase = class CreateSubServiceCategoryUseCase {
    constructor(_subServiceCategoryRepository, _serviceCategoryRepository, _storageService) {
        this._subServiceCategoryRepository = _subServiceCategoryRepository;
        this._serviceCategoryRepository = _serviceCategoryRepository;
        this._storageService = _storageService;
    }
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, description, bannerImage, serviceCategoryId, createdById, createdByRole, isActive, }) {
            //console.log('entered into the  create sub service category usecase ')
            const AlreadyExistServiceCategory = yield this._serviceCategoryRepository.findOne({ serviceCategoryId });
            if (!AlreadyExistServiceCategory) {
                throw new custom_error_1.CustomError('Service Category Is Not Valid', constants_1.HTTP_STATUS.NOT_FOUND);
            }
            // console.log(
            //   'The service category get found , ',
            //   AlreadyExistServiceCategory
            // )
            const AlreadyExistSubServiceCategory = yield this._subServiceCategoryRepository.findOne({
                name,
            });
            if (AlreadyExistSubServiceCategory) {
                throw new custom_error_1.CustomError('Already Existing Sub Category', constants_1.HTTP_STATUS.CONFLICT);
            }
            // console.log('sub service catgories', AlreadyExistSubServiceCategory)
            const bannerImageUrl = yield this._storageService.uploadFile(config_1.config.storageConfig.bucket, bannerImage, constants_1.S3_BUCKET_IMAGE_FOLDERS.SUB_SERVICE_CATEGORY_IMAGES);
            const subServiceCategoryId = (0, crypto_1.randomUUID)();
            if (!AlreadyExistServiceCategory._id) {
                throw new custom_error_1.CustomError('Service id not  existing', constants_1.HTTP_STATUS.NOT_FOUND);
            }
            const serviceCategoryRef = AlreadyExistServiceCategory._id.toString();
            const verification = 'pending';
            const data = {
                name,
                description,
                bannerImage: bannerImageUrl,
                serviceCategoryRef,
                subServiceCategoryId,
                createdById,
                createdByRole,
                isActive,
                verification,
            };
            //console.log('The data ,', data)
            yield this._subServiceCategoryRepository.save(data);
            //console.log('Th save')
            const entity = yield this._subServiceCategoryRepository.findOneAndPopulate({
                subServiceCategoryId,
            }, 'serviceCategoryRef');
            // console.log('The entity', entity)
            if (!entity) {
                throw new custom_error_1.CustomError('Failed to fetch created sub-service category', constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }
            return create_sub_service_category_mapper_1.CreateSubServiceCategoryResponseMapper.toDTO(entity);
        });
    }
};
exports.CreateSubServiceCategoryUseCase = CreateSubServiceCategoryUseCase;
exports.CreateSubServiceCategoryUseCase = CreateSubServiceCategoryUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('ISubServiceCategoryRepository')),
    __param(1, (0, tsyringe_1.inject)('IServiceCategoryRepository')),
    __param(2, (0, tsyringe_1.inject)('IStorageService')),
    __metadata("design:paramtypes", [Object, Object, Object])
], CreateSubServiceCategoryUseCase);
