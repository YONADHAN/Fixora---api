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
exports.WalletRepository = void 0;
const tsyringe_1 = require("tsyringe");
const wallet_model_1 = require("../../../database/mongoDb/models/wallet_model");
const base_repository_1 = require("../../base_repository");
const mongoose_1 = require("mongoose");
let WalletRepository = class WalletRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(wallet_model_1.WalletModel);
    }
    toModel(entity) {
        return {
            walletId: entity.walletId,
            userRef: entity.userRef ? new mongoose_1.Types.ObjectId(entity.userRef) : undefined,
            userType: entity.userType,
            currency: entity.currency,
            isActive: entity.isActive,
        };
    }
    toEntity(model) {
        return {
            _id: model._id.toString(),
            walletId: model.walletId,
            userRef: model.userRef.toString(),
            userType: model.userType,
            currency: model.currency,
            isActive: model.isActive,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
        };
    }
};
exports.WalletRepository = WalletRepository;
exports.WalletRepository = WalletRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], WalletRepository);
