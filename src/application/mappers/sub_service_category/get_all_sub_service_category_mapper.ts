import { ISubServiceCategoryEntity } from '../../../domain/models/sub_service_category_entity'
import { ResponseGetAllSubServiceCategoriesDTO } from '../../dtos/sub_service_category_dto'
export class GetAllSubServiceCategoriesRequestMapper {
  static toDTO({
    page,
    limit,
    search,
  }: {
    page: string
    limit: string
    search: string
  }) {
    return {
      page: Number(page),
      limit: Number(limit),
      search: search.trim(),
    }
  }
}

export class GetAllSubServiceCategoriesResponseMapper {
  static toDTO({
    data,
    currentPage,
    totalPages,
  }: {
    data: ISubServiceCategoryEntity[]
    currentPage: number
    totalPages: number
  }): ResponseGetAllSubServiceCategoriesDTO {
    const subServiceCategories = []
    for (let i = 0; i < data.length; i++) {
      const rawItem = data[i]
      const item = {
        subServiceCategoryId: rawItem.subServiceCategoryId,
        serviceCategoryId: rawItem.serviceCategoryId,
        serviceCategoryName: rawItem.serviceCategoryName,
        name: rawItem.name,
        description: rawItem.description,
        bannerImage: rawItem.bannerImage,
        isActive: rawItem.isActive,
        verification: rawItem.verification,
      }
      subServiceCategories.push(item)
    }
    return {
      data: subServiceCategories,
      currentPage,
      totalPages,
    }
  }
}
