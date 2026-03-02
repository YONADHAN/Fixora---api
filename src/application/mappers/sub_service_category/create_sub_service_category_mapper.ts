
import {
  IServiceCategoryPopulated,
  ISubServiceCategoryEntity,
} from '../../../domain/models/sub_service_category_entity'
import { statusTypes } from '../../../shared/constants'
import { ResponseCreateSubServiceCategoryDTO } from '../../dtos/sub_service_category_dto'

export class CreateSubServiceCategoryRequestMapper {
  static toDTO({
    body,
    file,
    createdById,
    createdByRole,
    isActive,
  }: {
    body: {
      name: string
      description: string
      serviceCategoryId: string
    }
    file: Express.Multer.File
    createdById: string
    createdByRole: string
    isActive: statusTypes
  }) {
    return {
      name: body.name,
      description: body.description,
      serviceCategoryId: body.serviceCategoryId,
      bannerImage: file,
      createdById,
      createdByRole,
      isActive,
    }
  }
}
export class CreateSubServiceCategoryResponseMapper {
  static toDTO(
    payload: ISubServiceCategoryEntity
  ): ResponseCreateSubServiceCategoryDTO {
    const populated = payload.serviceCategory as IServiceCategoryPopulated

    return {
      name: payload.name,
      description: payload.description,
      serviceCategoryId: populated?.serviceCategoryId ?? '',
      serviceCategoryName: populated?.name ?? '',
      subServiceCategoryId: payload.subServiceCategoryId,
      bannerImage: payload.bannerImage,
    }
  }
}
