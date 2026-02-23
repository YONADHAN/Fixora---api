import { ISubServiceCategoryEntity } from '../../../domain/models/sub_service_category_entity'

export class EditSubServiceCategoryRequestMapper {
  static toDTO({
    body,
    file,
  }: {
    body: {
      name: string
      description: string
      serviceCategoryId: string
      subServiceCategoryId: string
    }
    file: Express.Multer.File
  }) {
    return {
      name: body.name,
      description: body.description,
      serviceCategoryId: body.serviceCategoryId,
      subServiceCategoryId: body.subServiceCategoryId,
      bannerImage: file,
    }
  }
}

export class EditSubServiceCategoryResponseMapper {
  static toDTO(payload: ISubServiceCategoryEntity) {
    return {
      name: payload.name,
      description: payload.description,
      serviceCategoryId: payload.serviceCategory?.serviceCategoryId || '',
      serviceCategoryName: payload.serviceCategory?.name || '',
      subServiceCategoryId: payload.subServiceCategoryId,
      bannerImage: payload.bannerImage,
    }
  }
}
