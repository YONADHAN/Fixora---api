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
exports.UploadVendorDocsUseCase = void 0;
const tsyringe_1 = require("tsyringe");
let UploadVendorDocsUseCase = class UploadVendorDocsUseCase {
    constructor(_vendorRepository, _createNotificationUseCase, _adminRepository) {
        this._vendorRepository = _vendorRepository;
        this._createNotificationUseCase = _createNotificationUseCase;
        this._adminRepository = _adminRepository;
    }
    execute(userId, files, urls) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const vendor = yield this._vendorRepository.findOne({ userId });
            if (!vendor) {
                throw new Error('Vendor not found');
            }
            // Construct document objects
            const newDocuments = urls.map((url, index) => {
                var _a;
                return ({
                    name: ((_a = files[index]) === null || _a === void 0 ? void 0 : _a.originalname) || `document-${index + 1}`,
                    url,
                    verified: false,
                    uploadedAt: new Date(),
                });
            });
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
            yield this._vendorRepository.update({ userId }, vendor);
            const admins = yield this._adminRepository.findAllDocsWithoutPagination({});
            if (admins.length > 0) {
                const admin = admins[0];
                yield this._createNotificationUseCase.execute({
                    recipientId: admin.userId,
                    recipientRole: 'admin',
                    type: 'VENDOR_DOCUMENTS_SUBMITTED',
                    title: 'New Vendor Verification Request',
                    message: `Vendor ${vendor.userId} has submitted documents for verification`,
                    metadata: { vendorRef: (_a = vendor._id) === null || _a === void 0 ? void 0 : _a.toString() },
                });
            }
        });
    }
};
exports.UploadVendorDocsUseCase = UploadVendorDocsUseCase;
exports.UploadVendorDocsUseCase = UploadVendorDocsUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IVendorRepository')),
    __param(1, (0, tsyringe_1.inject)('ICreateNotificationUseCase')),
    __param(2, (0, tsyringe_1.inject)('IAdminRepository')),
    __metadata("design:paramtypes", [Object, Object, Object])
], UploadVendorDocsUseCase);
