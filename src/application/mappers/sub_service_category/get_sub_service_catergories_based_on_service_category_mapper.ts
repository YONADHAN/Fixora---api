import { ISubServiceCategoryEntity } from '../../../domain/models/sub_service_category_entity'
import { ResponseGetAllSubServiceCategoriesBasedOnServiceCategoryDTO } from '../../dtos/sub_service_category_dto'

export class GetAllSubServiceCategoriesBasedOnServiceCategoryIdRequestMapper {
  static toDTO({
    query,
  }: {
    query: {
      serviceCategoryId: string
      page: string
      limit: string
      search: string
    }
  }) {
    return {
      serviceCategoryId: query.serviceCategoryId,
      page: Number(query.page),
      limit: Number(query.limit),
      search: query.search,
    }
  }
}

export class GetAllSubServiceCategoriesBasedOnServiceCategoryIdResponseMapper {
  static toDTO(response: {
    data: ISubServiceCategoryEntity[]
    totalPages: number
    currentPage: number
  }): ResponseGetAllSubServiceCategoriesBasedOnServiceCategoryDTO {
    const result = []
    for (let i = 0; i < response.data.length; i++) {
      const item = response.data[i]
      if (item.isActive === 'active' && item.verification === 'accepted') {
        const data = {
          name: item.name,
          subServiceCategoryId: item.subServiceCategoryId,
          bannerImage: item.bannerImage,
          description: item.description,
        }
        result.push(data)
      }
    }

    return {
      data: result,
      totalPages: response.totalPages,
      currentPage: response.currentPage,
    }
  }
}
