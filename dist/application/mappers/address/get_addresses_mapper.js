"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAddressResponseMapper = exports.GetAddressRequestMapper = void 0;
class GetAddressRequestMapper {
    static toDTO(data) {
        var _a;
        return {
            page: data.page ? Number(data.page) : 1,
            limit: data.limit ? Number(data.limit) : 10,
            search: ((_a = data.search) === null || _a === void 0 ? void 0 : _a.trim()) || undefined,
            customerId: data.customerId,
        };
    }
}
exports.GetAddressRequestMapper = GetAddressRequestMapper;
class GetAddressResponseMapper {
    static toDTO(data) {
        return {
            currentPage: data.currentPage,
            totalPages: data.totalPages,
            data: data.data.map((address) => ({
                addressId: address.addressId,
                label: address.label,
                addressType: address.addressType,
                isDefault: address.isDefault,
                contactName: address.contactName,
                contactPhone: address.contactPhone,
                addressLine1: address.addressLine1,
                addressLine2: address.addressLine2,
                landmark: address.landmark,
                city: address.city,
                state: address.state,
                country: address.country,
                zipCode: address.zipCode,
                instructions: address.instructions,
                geoLocation: address.geoLocation,
                location: address.location,
                createdAt: address.createdAt,
                updatedAt: address.updatedAt,
            })),
        };
    }
}
exports.GetAddressResponseMapper = GetAddressResponseMapper;
