import { RequestToggleVerificationStatusOfSubServiceCategoryDTO } from '../../../application/dtos/sub_service_category_dto'

export interface IToggleVerificationStatusOfSubServiceCategoryUseCase {
  execute(
    payload: RequestToggleVerificationStatusOfSubServiceCategoryDTO
  ): Promise<void>
}
