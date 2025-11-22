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
      serviceCategoryName: string
      subServiceCategoryId: string
    }
    file: Express.Multer.File
  }) {
    return {
      name: body.name,
      description: body.description,
      serviceCategoryId: body.serviceCategoryId,
      serviceCategoryName: body.serviceCategoryName,
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
      serviceCategoryId: payload.serviceCategoryId,
      serviceCategoryName: payload.serviceCategoryName,
      subServiceCategoryId: payload.subServiceCategoryId,
      bannerImage: payload.bannerImage,
    }
  }
}
