import { IServiceEntity } from '../../../domain/models/service_entity'

export class GetAllServicesRequestMapper {
  static toDTO(validated: {
    query: { page: string; limit: string; search: string; vendorId: string }
  }) {
    return {
      page: Number(validated.query.page),
      limit: Number(validated.query.limit),
      search: validated.query.search,
      vendorId: validated.query.vendorId,
    }
  }
}

export class GetAllServicesResponseMapper {
  static toDTO(payload: {
    data: IServiceEntity[]
    totalPages: number
    currentPage: number
  }) {
    const filteredData = []
    for (let i = 0; i < payload.data.length; i++) {
      const Item = payload.data[i]
      const filteredItem = {
        serviceId: Item.serviceId,
        name: Item.name,
        description: Item.description,
        mainImage: Item.mainImage,
        isActiveStatusByVendor: Item.isActiveStatusByVendor,
      }
      filteredData.push(filteredItem)
    }
    return {
      data: filteredData,
      currentPage: payload.currentPage,
      totalPages: payload.totalPages,
    }
  }
}
