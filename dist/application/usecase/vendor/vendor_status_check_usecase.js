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
exports.VendorStatusCheckUsecase = void 0;
const tsyringe_1 = require("tsyringe");
let VendorStatusCheckUsecase = class VendorStatusCheckUsecase {
    constructor(_vendorRepository) {
        this._vendorRepository = _vendorRepository;
    }
    execute(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            const vendor = yield this._vendorRepository.findOne({ userId });
            if (!vendor)
                throw new Error('Vendor not found');
            const isVerified = vendor.isVerified || {};
            const verified = {
                status: isVerified.status === 'accepted' ||
                    isVerified.status === 'rejected' ||
                    isVerified.status === 'pending'
                    ? isVerified.status
                    : 'pending',
                description: (_a = isVerified.description) !== null && _a !== void 0 ? _a : '',
                reviewedBy: {
                    adminId: (_c = (_b = isVerified.reviewedBy) === null || _b === void 0 ? void 0 : _b.adminId) !== null && _c !== void 0 ? _c : null,
                    reviewedAt: (_e = (_d = isVerified.reviewedBy) === null || _d === void 0 ? void 0 : _d.reviewedAt) !== null && _e !== void 0 ? _e : undefined,
                },
                documentCount: ((_f = vendor.documents) === null || _f === void 0 ? void 0 : _f.length) || 0,
            };
            return verified;
        });
    }
};
exports.VendorStatusCheckUsecase = VendorStatusCheckUsecase;
exports.VendorStatusCheckUsecase = VendorStatusCheckUsecase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IVendorRepository')),
    __metadata("design:paramtypes", [Object])
], VendorStatusCheckUsecase);
