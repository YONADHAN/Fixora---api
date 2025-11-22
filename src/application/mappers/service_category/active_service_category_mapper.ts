import { IServiceCategoryEntity } from '../../../domain/models/service_category_entity'
import { ResponseActiveServiceCategoryDTO } from '../../dtos/service_category_dto'

export class ActiveServiceCategoryMapper {
  static toDTO(
    service_categories: IServiceCategoryEntity[]
  ): ResponseActiveServiceCategoryDTO {
    const active_service_categories = []
    for (let i = 0; i < service_categories.length; i++) {
      if (service_categories[i].isActive === true) {
        const filtered_service_category = {
          serviceCategoryId: service_categories[i].serviceCategoryId,
          name: service_categories[i].name,
          description: service_categories[i].description,
          bannerImage: service_categories[i].bannerImage,
        }
        active_service_categories.push(filtered_service_category)
      }
    }
    return {
      data: active_service_categories,
    }
  }
}
