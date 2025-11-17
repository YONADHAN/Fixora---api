"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorProfileMapper = void 0;
class VendorProfileMapper {
    static toDTO(customer) {
        return {
            userId: customer.userId,
            name: customer.name,
            email: customer.email,
            role: customer.role,
            phone: customer.phone || '',
            status: customer.status,
            location: customer.location,
        };
    }
}
exports.VendorProfileMapper = VendorProfileMapper;
