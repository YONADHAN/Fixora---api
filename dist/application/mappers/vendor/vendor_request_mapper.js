"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRequestMapper = void 0;
class VendorRequestMapper {
    static toDTO(vendor) {
        var _a, _b, _c, _d;
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
                status: (_b = (_a = vendor.isVerified) === null || _a === void 0 ? void 0 : _a.status) !== null && _b !== void 0 ? _b : 'pending',
                description: (_d = (_c = vendor.isVerified) === null || _c === void 0 ? void 0 : _c.description) !== null && _d !== void 0 ? _d : '',
            },
        };
    }
    static toDTOList(vendors) {
        return vendors.map((vendor) => this.toDTO(vendor));
    }
}
exports.VendorRequestMapper = VendorRequestMapper;
