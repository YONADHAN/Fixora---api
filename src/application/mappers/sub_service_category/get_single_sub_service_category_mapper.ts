import { ISubServiceCategoryEntity } from '../../../domain/models/sub_service_category_entity'
import { ResponseGetSingleSubServiceCategoryDTO } from '../../dtos/sub_service_category_dto'

export class GetSingleSubServiceCategoryRequestMapper {
  static toDTO({ params }: { params: { subServiceCategoryId: string } }) {
    return params.subServiceCategoryId
  }
}

export class GetSingleSubServiceCategoryResponseMapper {
  static toDTO(
    payload: ISubServiceCategoryEntity
  ): ResponseGetSingleSubServiceCategoryDTO {
    return {
      name: payload.name,
      subServiceCategoryId: payload.subServiceCategoryId,
      description: payload.description,
      serviceCategoryId: payload.serviceCategoryId,
      serviceCategoryName: payload.serviceCategoryName,
      bannerImage: payload.bannerImage,
      isActive: payload.isActive,
      createdById: payload.createdById,
      createdByRole: payload.createdByRole,
      createdAt: payload.createdAt ?? new Date(),
      updatedAt: payload.updatedAt ?? new Date(),
    }
  }
}
