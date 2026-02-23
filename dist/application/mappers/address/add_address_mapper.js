"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddAddressMapper = void 0;
class AddAddressMapper {
    static toDTO(data) {
        var _a;
        return {
            customerId: data.customerId,
            label: data.label,
            addressType: data.addressType,
            isDefault: (_a = data.isDefault) !== null && _a !== void 0 ? _a : false,
            contactName: data.contactName,
            contactPhone: data.contactPhone,
            addressLine1: data.addressLine1,
            addressLine2: data.addressLine2,
            landmark: data.landmark,
            city: data.city,
            state: data.state,
            country: data.country,
            zipCode: data.zipCode,
            instructions: data.instructions,
            geoLocation: {
                type: 'Point',
                coordinates: [Number(data.longitude), Number(data.latitude)],
            },
        };
    }
}
exports.AddAddressMapper = AddAddressMapper;
