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
exports.BookingHoldRepository = void 0;
const tsyringe_1 = require("tsyringe");
const mongoose_1 = require("mongoose");
const base_repository_1 = require("../../base_repository");
const booking_hold_model_1 = require("../../../database/mongoDb/models/booking_hold_model");
const custom_error_1 = require("../../../../domain/utils/custom.error");
let BookingHoldRepository = class BookingHoldRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(booking_hold_model_1.BookingHoldModel);
    }
    /* ───────────── Utilities ───────────── */
    validateObjectId(id, fieldName) {
        if (id && !mongoose_1.Types.ObjectId.isValid(id)) {
            throw new custom_error_1.CustomError(`Invalid ${fieldName}`, 400);
        }
    }
    /* ───────────── Entity → Model ───────────── */
    toModel(entity) {
        var _a;
        this.validateObjectId(entity.serviceRef, 'serviceRef');
        this.validateObjectId(entity.vendorRef, 'vendorRef');
        this.validateObjectId(entity.customerRef, 'customerRef');
        return {
            holdId: entity.holdId,
            serviceRef: entity.serviceRef
                ? new mongoose_1.Types.ObjectId(entity.serviceRef)
                : undefined,
            vendorRef: entity.vendorRef
                ? new mongoose_1.Types.ObjectId(entity.vendorRef)
                : undefined,
            customerRef: entity.customerRef
                ? new mongoose_1.Types.ObjectId(entity.customerRef)
                : undefined,
            addressId: entity.addressId,
            slots: (_a = entity.slots) === null || _a === void 0 ? void 0 : _a.map((s) => ({
                date: s.date,
                start: s.start,
                end: s.end,
                pricePerSlot: s.pricePerSlot,
                advancePerSlot: s.advancePerSlot,
                variant: s.variant
                    ? {
                        name: s.variant.name,
                        price: s.variant.price,
                    }
                    : undefined,
            })),
            pricing: entity.pricing
                ? {
                    totalAmount: entity.pricing.totalAmount,
                    advanceAmount: entity.pricing.advanceAmount,
                    remainingAmount: entity.pricing.remainingAmount,
                }
                : undefined,
            paymentMethod: entity.paymentMethod,
            stripePaymentIntentId: entity.stripePaymentIntentId,
            status: entity.status,
            expiresAt: entity.expiresAt,
        };
    }
    /* ───────────── Model → Entity ───────────── */
    toEntity(model) {
        return {
            _id: model._id.toString(),
            holdId: model.holdId,
            serviceRef: model.serviceRef.toString(),
            vendorRef: model.vendorRef.toString(),
            customerRef: model.customerRef.toString(),
            addressId: model.addressId,
            slots: model.slots.map((s) => ({
                date: s.date,
                start: s.start,
                end: s.end,
                pricePerSlot: s.pricePerSlot,
                advancePerSlot: s.advancePerSlot,
                variant: s.variant
                    ? {
                        name: s.variant.name,
                        price: s.variant.price,
                    }
                    : undefined,
            })),
            pricing: {
                totalAmount: model.pricing.totalAmount,
                advanceAmount: model.pricing.advanceAmount,
                remainingAmount: model.pricing.remainingAmount,
            },
            paymentMethod: model.paymentMethod,
            stripePaymentIntentId: model.stripePaymentIntentId,
            status: model.status,
            expiresAt: model.expiresAt,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
        };
    }
    /* ───────────── Custom Queries ───────────── */
    findActiveHoldById(holdId) {
        return __awaiter(this, void 0, void 0, function* () {
            const hold = yield this.model
                .findOne({ holdId, status: 'active' })
                .lean();
            return hold ? this.toEntity(hold) : null;
        });
    }
    findByStripePaymentIntentId(paymentIntentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const hold = yield this.model
                .findOne({ stripePaymentIntentId: paymentIntentId })
                .lean();
            return hold ? this.toEntity(hold) : null;
        });
    }
    markHoldAsCompleted(holdId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.updateOne({ holdId }, { $set: { status: 'completed' } });
        });
    }
    markHoldAsFailed(holdId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.updateOne({ holdId }, { $set: { status: 'failed' } });
        });
    }
    findExpiredActiveHolds(now) {
        return __awaiter(this, void 0, void 0, function* () {
            const holds = yield this.model
                .find({
                status: 'active',
                expiresAt: { $lt: now },
            })
                .lean();
            return holds.map((h) => this.toEntity(h));
        });
    }
    markHoldAsExpired(holdId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.updateOne({ holdId }, { $set: { status: 'expired' } });
        });
    }
};
exports.BookingHoldRepository = BookingHoldRepository;
exports.BookingHoldRepository = BookingHoldRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], BookingHoldRepository);
