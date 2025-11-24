import { inject, injectable } from 'tsyringe'
import { ISubServiceCategoryRepository } from '../../../domain/repositoryInterfaces/feature/service/sub_service_catgory_repository.interface'
import { RequestToggleBlockStatusOfSubServiceCategoryDTO } from '../../dtos/sub_service_category_dto'
import { CustomError } from '../../../domain/utils/custom.error'
import { HTTP_STATUS } from '../../../shared/constants'
import { IToggleBlockStatusOfSubServiceCategoryUseCase } from '../../../domain/useCaseInterfaces/sub_service_category/toggle_block_status_of_sub_service_usecase.interface'

@injectable()
export class ToggleBlockStatusOfSubServiceCategoryUseCase
  implements IToggleBlockStatusOfSubServiceCategoryUseCase
{
  constructor(
    @inject('ISubServiceCategoryRepository')
    private _subServiceCategoryRepository: ISubServiceCategoryRepository
  ) {}

  async execute(
    payload: RequestToggleBlockStatusOfSubServiceCategoryDTO
  ): Promise<void> {
    const { subServiceCategoryId, blockStatus } = payload
    const subServiceCategoryExists =
      await this._subServiceCategoryRepository.findOne({ subServiceCategoryId })
    if (!subServiceCategoryExists) {
      throw new CustomError(
        'Sub Service Category Is Not Found',
        HTTP_STATUS.NOT_FOUND
      )
    }
    const oldStatus = subServiceCategoryExists.isActive
    if (blockStatus === oldStatus) {
      throw new CustomError(
        `Status ${blockStatus} already exists.`,
        HTTP_STATUS.CONFLICT
      )
    }
    const data = {
      isActive: blockStatus,
    }
    await this._subServiceCategoryRepository.update(
      { subServiceCategoryId },
      data
    )
  }
}
