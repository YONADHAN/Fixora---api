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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadVendorDocsUseCase = void 0;
const tsyringe_1 = require("tsyringe");
let UploadVendorDocsUseCase = class UploadVendorDocsUseCase {
    constructor(_vendorRepository) {
        this._vendorRepository = _vendorRepository;
    }
    async execute(userId, files, urls) {
        const vendor = await this._vendorRepository.findOne({ userId });
        if (!vendor) {
            throw new Error('Vendor not found');
        }
        // Construct document objects
        const newDocuments = urls.map((url, index) => ({
            name: files[index]?.originalname || `document-${index + 1}`,
            url,
            verified: false,
            uploadedAt: new Date(),
        }));
        vendor.documents = [...(vendor.documents || []), ...newDocuments];
        if (!vendor.isVerified) {
            vendor.isVerified = {
                status: 'pending',
                description: '',
                reviewedBy: { adminId: null, reviewedAt: new Date() },
            };
        }
        else {
            vendor.isVerified.status = 'pending';
        }
        await this._vendorRepository.update({ userId }, vendor);
    }
};
exports.UploadVendorDocsUseCase = UploadVendorDocsUseCase;
exports.UploadVendorDocsUseCase = UploadVendorDocsUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IVendorRepository')),
    __metadata("design:paramtypes", [Object])
], UploadVendorDocsUseCase);
