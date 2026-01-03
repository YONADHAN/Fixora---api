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
exports.AddressRepository = void 0;
const tsyringe_1 = require("tsyringe");
const base_repository_1 = require("../../base_repository");
const address_model_1 = require("../../../database/mongoDb/models/address_model");
const custom_error_1 = require("../../../../domain/utils/custom.error");
let AddressRepository = class AddressRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(address_model_1.AddressModel);
    }
    toEntity(model) {
        return {
            _id: model._id.toString(),
            addressId: model.addressId,
            customerId: model.customerId,
            label: model.label,
            addressType: model.addressType,
            isDefault: model.isDefault,
            isActive: model.isActive,
            contactName: model.contactName,
            contactPhone: model.contactPhone,
            addressLine1: model.addressLine1,
            addressLine2: model.addressLine2,
            landmark: model.landmark,
            city: model.city,
            state: model.state,
            country: model.country,
            zipCode: model.zipCode,
            instructions: model.instructions,
            geoLocation: model.geoLocation,
            location: model.location,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
        };
    }
    toModel(entity) {
        if (entity.geoLocation) {
            this.validateGeoLocation(entity.geoLocation);
        }
        return {
            addressId: entity.addressId,
            customerId: entity.customerId,
            label: entity.label,
            addressType: entity.addressType,
            isDefault: entity.isDefault,
            isActive: entity.isActive,
            contactName: entity.contactName,
            contactPhone: entity.contactPhone,
            addressLine1: entity.addressLine1,
            addressLine2: entity.addressLine2,
            landmark: entity.landmark,
            city: entity.city,
            state: entity.state,
            country: entity.country,
            zipCode: entity.zipCode,
            instructions: entity.instructions,
            geoLocation: entity.geoLocation,
            location: entity.location,
        };
    }
    validateGeoLocation(geoLocation) {
        if (geoLocation.type !== 'Point' ||
            !Array.isArray(geoLocation.coordinates) ||
            geoLocation.coordinates.length !== 2) {
            throw new custom_error_1.CustomError('Invalid geoLocation format', 400);
        }
    }
    findDefaultAddress(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = yield this.model
                .findOne({ customerId, isDefault: true, isActive: true })
                .lean();
            return address ? this.toEntity(address) : null;
        });
    }
    findAddressByCustomerId(page_1, limit_1) {
        return __awaiter(this, arguments, void 0, function* (page, limit, search = '', extraFilters = {}) {
            const skip = (page - 1) * limit;
            const filter = Object.assign(Object.assign({}, extraFilters), (search
                ? {
                    $or: [
                        { label: { $regex: search, $options: 'i' } },
                        { addressType: { $regex: search, $options: 'i' } },
                        { city: { $regex: search, $options: 'i' } },
                        { state: { $regex: search, $options: 'i' } },
                        { zipCode: { $regex: search, $options: 'i' } },
                    ],
                }
                : {}));
            const [documents, totalCount] = yield Promise.all([
                this.model
                    .find(filter)
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 })
                    .lean(),
                this.model.countDocuments(filter),
            ]);
            return {
                data: documents.map((doc) => this.toEntity(doc)),
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
            };
        });
    }
    clearDefaultAddress(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.updateMany({ customerId }, { $set: { isDefault: false } });
        });
    }
    setDefaultAddress(customerId, addressId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.updateMany({ customerId }, { $set: { isDefault: false } });
            const result = yield this.model.updateOne({ addressId, customerId }, { $set: { isDefault: true } });
            if (result.matchedCount === 0) {
                throw new custom_error_1.CustomError('Address not found', 404);
            }
        });
    }
};
exports.AddressRepository = AddressRepository;
exports.AddressRepository = AddressRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], AddressRepository);
