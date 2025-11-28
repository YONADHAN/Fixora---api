import {
  RequestGetVendorSubServiceCategoriesDTO,
  ResponseGetVendorSubServiceCategoriesDTO,
} from '../../../application/dtos/sub_service_category_dto'

export interface IGetVendorSubServiceCategoriesUseCase {
  execute(
    payload: RequestGetVendorSubServiceCategoriesDTO
  ): Promise<ResponseGetVendorSubServiceCategoriesDTO>
}
