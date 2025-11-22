import { IServiceCategoryEntity } from '../../../domain/models/service_category_entity'
import { ResponseServiceCategoryDTO } from '../../dtos/service_category_dto'

export class ServiceCategoryMapper {
  static toDTO(response: {
    data: IServiceCategoryEntity[]
    currentPage: number
    totalPages: number
  }): ResponseServiceCategoryDTO {
    const service_category_data = []
    for (let i = 0; i < response.data.length; i++) {
      const service_category = response.data[i]
      const filtered_service_category = {
        serviceCategoryId: service_category.serviceCategoryId,
        name: service_category.name,
        description: service_category.description,
        bannerImage: service_category.bannerImage,
        isActive: service_category.isActive,
      }
      service_category_data.push(filtered_service_category)
    }
    return {
      data: service_category_data,
      currentPage: response.currentPage,
      totalPages: response.totalPages,
    }
  }
}
