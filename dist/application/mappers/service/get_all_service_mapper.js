"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllServicesResponseMapper = exports.GetAllServicesRequestMapper = void 0;
class GetAllServicesRequestMapper {
    static toDTO(validated) {
        return {
            page: Number(validated.query.page),
            limit: Number(validated.query.limit),
            search: validated.query.search,
            vendorId: validated.query.vendorId,
        };
    }
}
exports.GetAllServicesRequestMapper = GetAllServicesRequestMapper;
class GetAllServicesResponseMapper {
    static toDTO(payload) {
        const filteredData = [];
        for (let i = 0; i < payload.data.length; i++) {
            const Item = payload.data[i];
            const filteredItem = {
                serviceId: Item.serviceId,
                name: Item.name,
                description: Item.description,
                mainImage: Item.mainImage,
                isActiveStatusByVendor: Item.isActiveStatusByVendor,
            };
            filteredData.push(filteredItem);
        }
        return {
            data: filteredData,
            currentPage: payload.currentPage,
            totalPages: payload.totalPages,
        };
    }
}
exports.GetAllServicesResponseMapper = GetAllServicesResponseMapper;
