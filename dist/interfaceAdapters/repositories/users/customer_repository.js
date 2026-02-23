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
exports.CustomerRepository = void 0;
const tsyringe_1 = require("tsyringe");
const base_repository_1 = require("../base_repository");
const customer_model_1 = require("../../database/mongoDb/models/customer_model");
let CustomerRepository = class CustomerRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(customer_model_1.CustomerModel);
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
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
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
        };
    }
};
exports.CustomerRepository = CustomerRepository;
exports.CustomerRepository = CustomerRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], CustomerRepository);
