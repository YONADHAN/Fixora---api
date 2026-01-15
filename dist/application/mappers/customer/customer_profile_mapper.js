"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerProfileMapper = void 0;
class CustomerProfileMapper {
    static toDTO(customer) {
        return {
            userId: customer.userId,
            name: customer.name,
            email: customer.email,
            role: customer.role,
            phone: customer.phone || '',
            status: customer.status,
            profileImage: customer.profileImage,
            location: customer.location,
        };
    }
}
exports.CustomerProfileMapper = CustomerProfileMapper;
