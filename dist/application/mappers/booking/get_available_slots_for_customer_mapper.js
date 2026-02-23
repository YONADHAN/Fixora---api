"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestGetAvailableSlotsForCustomerRequestMapper = void 0;
class RequestGetAvailableSlotsForCustomerRequestMapper {
    static toDTO(data) {
        return {
            month: Number(data.month),
            year: Number(data.year),
            serviceId: data.serviceId,
        };
    }
}
exports.RequestGetAvailableSlotsForCustomerRequestMapper = RequestGetAvailableSlotsForCustomerRequestMapper;
