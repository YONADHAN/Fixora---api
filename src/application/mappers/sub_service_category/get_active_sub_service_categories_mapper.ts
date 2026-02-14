import { ISubServiceCategoryEntity } from '../../../domain/models/sub_service_category_entity'

export class GetActiveSubServiceCategoriesResponseMapper {
  static toDTO(response: ISubServiceCategoryEntity[]) {
    const result: {
      subServiceCategoryId: string
      name: string
    }[] = []

    for (let i = 0; i < response.length; i++) {
      const item = {
        subServiceCategoryId: response[i].subServiceCategoryId,
        name: response[i].name,
      }
      result.push(item)
    }

    return result
  }
}
