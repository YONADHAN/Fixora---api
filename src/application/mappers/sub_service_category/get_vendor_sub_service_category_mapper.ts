import { ISubServiceCategoryEntity } from '../../../domain/models/sub_service_category_entity'

export class GetVendorSubServiceCategoriesRequestMapper {
  static toDTO({
    query,
  }: {
    query: {
      vendorId: string
      page: string
      limit: string
      search: string
    }
  }) {
    return {
      vendorId: query.vendorId,
      page: Number(query.page),
      limit: Number(query.limit),
      search: query.search || '',
    }
  }
}

export class GetVendorSubServiceCategoriesResponseMapper {
  static toDTO(response: {
    data: ISubServiceCategoryEntity[]
    currentPage: number
    totalPages: number
  }) {
    let filteredServiceData = []
    for (let i = 0; i < response.data.length; i++) {
      let document = response.data[i]
      const filteredDoc = {
        subServiceCategoryId: document.subServiceCategoryId,
        serviceCategoryId: document.serviceCategory?.serviceCategoryId || '',
        serviceCategoryName: document.serviceCategory?.name || '',
        name: document.name,
        description: document.description,
        bannerImage: document.bannerImage,
        isActive: document.isActive,
        verification: document.verification,
      }
      filteredServiceData.push(filteredDoc)
    }
    return {
      data: filteredServiceData,
      currentPage: response.currentPage,
      totalPages: response.totalPages,
    }
  }
}
