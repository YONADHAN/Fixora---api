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
exports.SlotRepository = void 0;
const tsyringe_1 = require("tsyringe");
const slot_model_1 = require("../../../database/mongoDb/models/slot_model");
const base_repository_1 = require("../../base_repository");
const mongoose_1 = require("mongoose");
let SlotRepository = class SlotRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(slot_model_1.SlotModel);
    }
    toEntity(model) {
        return {
            _id: model._id.toString(),
            slotId: model.slotId,
            serviceRef: model.serviceRef.toString(),
            slotDate: model.slotDate,
            startTime: model.startTime,
            endTime: model.endTime,
            bookingStatus: model.bookingStatus,
            bookedBy: model.bookedBy ? model.bookedBy.toString() : undefined,
            bookingId: model.bookingId ? model.bookingId.toString() : undefined,
        };
    }
    toModel(entity) {
        return {
            slotId: entity.slotId,
            serviceRef: entity.serviceRef
                ? new mongoose_1.Schema.Types.ObjectId(entity.serviceRef)
                : undefined,
            slotDate: entity.slotDate,
            startTime: entity.startTime,
            endTime: entity.endTime,
            bookingStatus: entity.bookingStatus,
            bookedBy: entity.bookedBy
                ? new mongoose_1.Schema.Types.ObjectId(entity.bookedBy)
                : undefined,
            bookingId: entity.bookingId
                ? new mongoose_1.Schema.Types.ObjectId(entity.bookingId)
                : undefined,
        };
    }
};
exports.SlotRepository = SlotRepository;
exports.SlotRepository = SlotRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], SlotRepository);
