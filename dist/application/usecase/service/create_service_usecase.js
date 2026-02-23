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
exports.CreateServiceUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const crypto_1 = require("crypto");
const custom_error_1 = require("../../../domain/utils/custom.error");
const constants_1 = require("../../../shared/constants");
const config_1 = require("../../../shared/config");
let CreateServiceUseCase = class CreateServiceUseCase {
    constructor(serviceRepo, subCategoryRepo, vendorRepo, storageService) {
        this.serviceRepo = serviceRepo;
        this.subCategoryRepo = subCategoryRepo;
        this.vendorRepo = vendorRepo;
        this.storageService = storageService;
    }
    execute(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { vendorId, subServiceCategoryId, name, description, serviceVariants, pricing, mainImage, schedule, isActiveStatusByVendor, isActiveStatusByAdmin, adminStatusNote, } = payload;
            const vendor = yield this.vendorRepo.findOne({ userId: vendorId });
            if (!vendor)
                throw new custom_error_1.CustomError('Vendor not found', constants_1.HTTP_STATUS.NOT_FOUND);
            if (!vendor._id)
                throw new custom_error_1.CustomError('Vendor ID missing in database record', constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
            const category = yield this.subCategoryRepo.findOne({
                subServiceCategoryId,
            });
            if (!category)
                throw new custom_error_1.CustomError('Sub service category not found', constants_1.HTTP_STATUS.NOT_FOUND);
            if (!category._id)
                throw new custom_error_1.CustomError('Sub-category ID missing in database record', constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
            const serviceId = (0, crypto_1.randomUUID)();
            const url = yield this.storageService.uploadFile(config_1.config.storageConfig.bucket, mainImage, `${constants_1.S3_BUCKET_IMAGE_FOLDERS.SERVICE_IMAGES}/${serviceId}`);
            const entity = {
                vendorRef: vendor._id.toString(),
                subServiceCategoryRef: category._id.toString(),
                serviceId,
                name,
                description,
                serviceVariants: serviceVariants !== null && serviceVariants !== void 0 ? serviceVariants : [],
                pricing: {
                    pricePerSlot: pricing.pricePerSlot,
                    advanceAmountPerSlot: pricing.advanceAmountPerSlot,
                },
                mainImage: url,
                isActiveStatusByAdmin: isActiveStatusByAdmin !== null && isActiveStatusByAdmin !== void 0 ? isActiveStatusByAdmin : true,
                isActiveStatusByVendor,
                adminStatusNote: adminStatusNote !== null && adminStatusNote !== void 0 ? adminStatusNote : '',
                schedule: Object.assign({}, schedule),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            yield this.serviceRepo.save(entity);
        });
    }
};
exports.CreateServiceUseCase = CreateServiceUseCase;
exports.CreateServiceUseCase = CreateServiceUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IServiceRepository')),
    __param(1, (0, tsyringe_1.inject)('ISubServiceCategoryRepository')),
    __param(2, (0, tsyringe_1.inject)('IVendorRepository')),
    __param(3, (0, tsyringe_1.inject)('IStorageService')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], CreateServiceUseCase);
