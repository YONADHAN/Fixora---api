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
exports.EditServiceCategoryUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const config_1 = require("../../../shared/config");
let EditServiceCategoryUseCase = class EditServiceCategoryUseCase {
    constructor(_serviceCategoryRepository, _storageService) {
        this._serviceCategoryRepository = _serviceCategoryRepository;
        this._storageService = _storageService;
    }
    execute(categoryId, name, description, bannerImage) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('category id got:', categoryId);
            const category = yield this._serviceCategoryRepository.findOne({
                serviceCategoryId: categoryId,
            });
            if (!category) {
                throw new Error('Category not found');
            }
            let bannerImageUrl = category.bannerImage;
            if (bannerImage) {
                if (category.bannerImage) {
                    yield this._storageService.deleteFile(config_1.config.storageConfig.bucket, category.bannerImage);
                }
                bannerImageUrl = yield this._storageService.uploadFile(config_1.config.storageConfig.bucket, bannerImage, 'service-categories');
            }
            category.name = name;
            category.description = description;
            category.bannerImage = bannerImageUrl;
            yield this._serviceCategoryRepository.update({ serviceCategoryId: categoryId }, category);
        });
    }
};
exports.EditServiceCategoryUseCase = EditServiceCategoryUseCase;
exports.EditServiceCategoryUseCase = EditServiceCategoryUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IServiceCategoryRepository')),
    __param(1, (0, tsyringe_1.inject)('IStorageService')),
    __metadata("design:paramtypes", [Object, Object])
], EditServiceCategoryUseCase);
