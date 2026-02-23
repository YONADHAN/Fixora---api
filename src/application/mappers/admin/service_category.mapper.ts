import { IServiceCategoryEntity } from '../../../domain/models/service_category_entity'
import { ServiceCategoryResponseDTO } from '../../dtos/admin/service_category_dto'
export const toServiceCategoryDTO = (
  entity: IServiceCategoryEntity
): ServiceCategoryResponseDTO => {
  return {
    serviceCategoryId: entity.serviceCategoryId,
    name: entity.name,
    description: entity.description,
    bannerImage: entity.bannerImage,
    isActive: entity.isActive,
  }
}
