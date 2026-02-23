"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditAddressMapper = void 0;
class EditAddressMapper {
    static toDTO(data) {
        const dto = {
            addressId: data.addressId,
        };
        const fields = [
            'label',
            'addressType',
            'isDefault',
            'isActive',
            'contactName',
            'contactPhone',
            'addressLine1',
            'addressLine2',
            'landmark',
            'city',
            'state',
            'country',
            'zipCode',
            'instructions',
        ];
        for (const field of fields) {
            if (data[field] !== undefined) {
                dto[field] = data[field];
            }
        }
        if (data.latitude && data.longitude) {
            dto.geoLocation = {
                type: 'Point',
                coordinates: [Number(data.longitude), Number(data.latitude)],
            };
        }
        return dto;
    }
}
exports.EditAddressMapper = EditAddressMapper;
