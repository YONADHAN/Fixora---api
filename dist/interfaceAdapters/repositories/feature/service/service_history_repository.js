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
exports.ServiceHistoryRepository = void 0;
const tsyringe_1 = require("tsyringe");
const service_history_model_1 = require("../../../database/mongoDb/models/service_history_model");
const base_repository_1 = require("../../base_repository");
const mongoose_1 = require("mongoose");
let ServiceHistoryRepository = class ServiceHistoryRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(service_history_model_1.ServiceHistoryModel);
    }
    // DOMAIN → DB
    toModel(entity) {
        return {
            serviceRef: entity.serviceRef
                ? new mongoose_1.Schema.Types.ObjectId(entity.serviceRef)
                : undefined,
            historyId: entity.historyId,
            title: entity.title,
            description: entity.description,
            images: entity.images,
            completedOn: entity.completedOn,
        };
    }
    // DB → DOMAIN
    toEntity(model) {
        return {
            _id: model._id.toString(),
            serviceRef: model.serviceRef.toString(),
            historyId: model.historyId,
            title: model.title,
            description: model.description,
            images: model.images,
            completedOn: model.completedOn,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
        };
    }
};
exports.ServiceHistoryRepository = ServiceHistoryRepository;
exports.ServiceHistoryRepository = ServiceHistoryRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], ServiceHistoryRepository);
