"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRequestMapper = void 0;
class VendorRequestMapper {
    static toDTO(vendor) {
        return {
            userId: vendor.userId,
            name: vendor.name,
            email: vendor.email,
            documents: Array.isArray(vendor.documents)
                ? vendor.documents.map((doc) => ({
                    name: doc.name,
                    url: doc.url,
                }))
                : [],
            isVerified: {
                status: vendor.isVerified?.status ?? 'pending',
                description: vendor.isVerified?.description ?? '',
            },
        };
    }
    static toDTOList(vendors) {
        return vendors.map((vendor) => this.toDTO(vendor));
    }
}
exports.VendorRequestMapper = VendorRequestMapper;
