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
exports.WalletTransactionRepository = void 0;
const tsyringe_1 = require("tsyringe");
const mongoose_1 = require("mongoose");
const base_repository_1 = require("../../base_repository");
const wallet_transaction_model_1 = require("../../../database/mongoDb/models/wallet_transaction_model");
let WalletTransactionRepository = class WalletTransactionRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(wallet_transaction_model_1.WalletTransactionModel);
    }
    toModel(entity) {
        return {
            transactionId: entity.transactionId,
            walletRef: entity.walletRef
                ? new mongoose_1.Types.ObjectId(entity.walletRef)
                : undefined,
            userRef: entity.userRef ? new mongoose_1.Types.ObjectId(entity.userRef) : undefined,
            type: entity.type,
            source: entity.source,
            amount: entity.amount,
            currency: entity.currency,
            description: entity.description,
            bookingRef: entity.bookingRef
                ? new mongoose_1.Types.ObjectId(entity.bookingRef)
                : undefined,
            bookingHoldRef: entity.bookingHoldRef
                ? new mongoose_1.Types.ObjectId(entity.bookingHoldRef)
                : undefined,
            paymentRef: entity.paymentRef
                ? new mongoose_1.Types.ObjectId(entity.paymentRef)
                : undefined,
            stripePaymentIntentId: entity.stripePaymentIntentId,
        };
    }
    toEntity(model) {
        var _a, _b, _c;
        return {
            _id: model._id.toString(),
            transactionId: model.transactionId,
            walletRef: model.walletRef.toString(),
            userRef: model.userRef.toString(),
            type: model.type,
            source: model.source,
            amount: model.amount,
            currency: model.currency,
            description: model.description,
            bookingRef: (_a = model.bookingRef) === null || _a === void 0 ? void 0 : _a.toString(),
            bookingHoldRef: (_b = model.bookingHoldRef) === null || _b === void 0 ? void 0 : _b.toString(),
            paymentRef: (_c = model.paymentRef) === null || _c === void 0 ? void 0 : _c.toString(),
            stripePaymentIntentId: model.stripePaymentIntentId,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
        };
    }
};
exports.WalletTransactionRepository = WalletTransactionRepository;
exports.WalletTransactionRepository = WalletTransactionRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], WalletTransactionRepository);
