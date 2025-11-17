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
exports.ChangeVendorVerificationStatusUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const constants_1 = require("../../../../shared/constants");
const custom_error_1 = require("../../../../domain/utils/custom.error");
let ChangeVendorVerificationStatusUseCase = class ChangeVendorVerificationStatusUseCase {
    constructor(_vendorRepository, _storageService) {
        this._vendorRepository = _vendorRepository;
        this._storageService = _storageService;
    }
    /**
     * Extract bucket and key from AWS S3 URL
     * Example: https://fixora-storage-yonadhan.s3.ap-south-1.amazonaws.com/vendor-verification-docs/abc123.png
     */
    extractBucketAndKey(url) {
        try {
            // Example URL parts:
            //   domain = fixora-storage-yonadhan.s3.ap-south-1.amazonaws.com
            //   bucket = fixora-storage-yonadhan
            const match = url.match(/^https?:\/\/([^.]+)\.s3[.-][^/]+\.amazonaws\.com\/(.+)$/);
            if (!match) {
                console.warn('⚠️ Invalid AWS S3 URL format:', url);
                return null;
            }
            const bucket = match[1]; // fixora-storage-yonadhan
            const key = match[2]; // vendor-verification-docs/abc123.png
            return { bucket, key };
        }
        catch (err) {
            console.error(' Failed to extract bucket/key from S3 URL:', url, err);
            return null;
        }
    }
    async execute({ userId, verificationStatus, adminId, description, }) {
        console.log('entered the change vendor verification status usecase');
        const vendor = await this._vendorRepository.findOne({ userId });
        if (!vendor) {
            throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.USER_NOT_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
        }
        if (vendor.isVerified?.status === verificationStatus) {
            throw new custom_error_1.CustomError('Vendor already has this verification status', constants_1.HTTP_STATUS.CONFLICT);
        }
        const reviewedAt = new Date();
        const finalDescription = verificationStatus === 'accepted'
            ? `Admin ${adminId} verified vendor ${vendor.userId ?? 'unknown'} documents successfully.`
            : description?.trim() || 'Rejected by admin.';
        /**
         * 🔴 If rejected → delete all uploaded documents from MinIO + clear MongoDB
         */
        if (verificationStatus === 'rejected' && Array.isArray(vendor.documents)) {
            console.log(`Deleting ${vendor.documents.length} vendor docs from MinIO...`);
            for (const doc of vendor.documents) {
                const parsed = this.extractBucketAndKey(doc.url);
                if (!parsed) {
                    console.warn('⚠️ Skipping invalid URL:', doc.url);
                    continue;
                }
                try {
                    await this._storageService.deleteFile(parsed.bucket, parsed.key);
                    console.log(`🗑️ Deleted: ${parsed.bucket}/${parsed.key}`);
                }
                catch (err) {
                    console.error(` Failed to delete ${parsed.key}:`, err);
                }
            }
            // 🧹 Clear MongoDB docs reference
            vendor.documents = [];
        }
        vendor.isVerified = {
            status: verificationStatus,
            reviewedBy: { adminId, reviewedAt },
            description: finalDescription,
        };
        await this._vendorRepository.update({ userId }, vendor);
        console.log(' Vendor verification status updated successfully');
        return {
            userId: vendor.userId ?? '',
            name: vendor.name ?? '',
            status: verificationStatus,
            reviewedBy: { adminId, reviewedAt },
            description: finalDescription,
        };
    }
};
exports.ChangeVendorVerificationStatusUseCase = ChangeVendorVerificationStatusUseCase;
exports.ChangeVendorVerificationStatusUseCase = ChangeVendorVerificationStatusUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IVendorRepository')),
    __param(1, (0, tsyringe_1.inject)('IStorageService')),
    __metadata("design:paramtypes", [Object, Object])
], ChangeVendorVerificationStatusUseCase);
