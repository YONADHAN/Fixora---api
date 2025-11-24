import { ISubServiceCategoryEntity } from '../../../domain/models/sub_service_category_entity'
import { statusTypes } from '../../../shared/constants'

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
      serviceCategoryName: string
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
      serviceCategoryName: body.serviceCategoryName,
      bannerImage: file,
      createdById,
      createdByRole,
      isActive,
    }
  }
}

export class CreateSubServiceCategoryResponseMapper {
  static toDTO(payload: ISubServiceCategoryEntity) {
    return {
      name: payload.name,
      description: payload.description,
      serviceCategoryId: payload.serviceCategoryId,
      serviceCategoryName: payload.serviceCategoryName,
      subServiceCategoryId: payload.subServiceCategoryId,
      bannerImage: payload.bannerImage,
    }
  }
}
