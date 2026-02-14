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
exports.VendorRepository = void 0;
const tsyringe_1 = require("tsyringe");
const base_repository_1 = require("../base_repository");
const vendor_model_1 = require("../../database/mongoDb/models/vendor_model");
let VendorRepository = class VendorRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(vendor_model_1.VendorModel);
    }
    toEntity(model) {
        return {
            userId: model.userId,
            _id: model._id,
            name: model.name,
            email: model.email,
            phone: model.phone,
            password: model.password,
            role: model.role,
            status: model.status,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
            googleId: model.googleId,
            profileImage: model.profileImage,
            geoLocation: model.geoLocation
                ? {
                    type: model.geoLocation.type,
                    coordinates: model.geoLocation.coordinates,
                }
                : undefined,
            location: model.location
                ? {
                    name: model.location.name,
                    displayName: model.location.displayName,
                    zipCode: model.location.zipCode,
                }
                : undefined,
            documents: model.documents
                ? model.documents.map((doc) => ({
                    name: doc.name,
                    url: doc.url,
                    verified: doc.verified,
                    uploadedAt: doc.uploadedAt,
                }))
                : undefined,
            isVerified: model.isVerified
                ? {
                    status: model.isVerified.status,
                    description: model.isVerified.description,
                    reviewedBy: model.isVerified.reviewedBy
                        ? {
                            adminId: model.isVerified.reviewedBy.adminId,
                            reviewedAt: model.isVerified.reviewedBy.reviewedAt,
                        }
                        : undefined,
                }
                : undefined,
        };
    }
    toModel(entity) {
        return {
            userId: entity.userId,
            name: entity.name,
            email: entity.email,
            phone: entity.phone,
            password: entity.password,
            role: entity.role,
            status: entity.status,
            googleId: entity.googleId,
            profileImage: entity.profileImage,
            geoLocation: entity.geoLocation
                ? {
                    type: entity.geoLocation.type,
                    coordinates: entity.geoLocation.coordinates,
                }
                : undefined,
            location: entity.location
                ? {
                    name: entity.location.name,
                    displayName: entity.location.displayName,
                    zipCode: entity.location.zipCode,
                }
                : undefined,
            documents: entity.documents
                ? entity.documents.map((doc) => ({
                    name: doc.name,
                    url: doc.url,
                    verified: doc.verified,
                    uploadedAt: doc.uploadedAt,
                }))
                : undefined,
            isVerified: entity.isVerified
                ? {
                    status: entity.isVerified.status,
                    description: entity.isVerified.description,
                    reviewedBy: entity.isVerified.reviewedBy
                        ? {
                            adminId: entity.isVerified.reviewedBy.adminId,
                            reviewedAt: entity.isVerified.reviewedBy.reviewedAt,
                        }
                        : undefined,
                }
                : undefined,
        };
    }
    findNearestVendors(lat, lng, radiusInKm) {
        return __awaiter(this, void 0, void 0, function* () {
            const radiusInRadians = radiusInKm / 6378.1; // Earth's radius in km
            const models = yield this.model.find({
                'geoLocation.coordinates': {
                    $geoWithin: {
                        $centerSphere: [[lng, lat], radiusInRadians],
                    },
                },
                status: 'active', // Ensure we only get active vendors
            });
            return models.map((model) => this.toEntity(model));
        });
    }
};
exports.VendorRepository = VendorRepository;
exports.VendorRepository = VendorRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], VendorRepository);
