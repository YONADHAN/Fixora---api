import {
  RequestCreateSubServiceCategoryDTO,
  ResponseCreateSubServiceCategoryDTO,
} from '../../../application/dtos/sub_service_category_dto'

export interface ICreateSubServiceCategoryUseCase {
  execute({
    name,
    description,
    bannerImage,
  }: RequestCreateSubServiceCategoryDTO): Promise<ResponseCreateSubServiceCategoryDTO>
}
