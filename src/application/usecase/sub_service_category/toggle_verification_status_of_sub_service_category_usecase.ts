import { inject, injectable } from 'tsyringe'
import { ISubServiceCategoryRepository } from '../../../domain/repositoryInterfaces/feature/service/sub_service_catgory_repository.interface'
import { CustomError } from '../../../domain/utils/custom.error'
import { HTTP_STATUS } from '../../../shared/constants'
import { RequestToggleVerificationStatusOfSubServiceCategoryDTO } from '../../dtos/sub_service_category_dto'
import { IToggleVerificationStatusOfSubServiceCategoryUseCase } from '../../../domain/useCaseInterfaces/sub_service_category/toggle_verification_status_of_sub_service_category_usecase.interface'

@injectable()
export class ToggleVerificationStatusOfSubServiceCategoryUseCase
  implements IToggleVerificationStatusOfSubServiceCategoryUseCase
{
  constructor(
    @inject('ISubServiceCategoryRepository')
    private _subServiceCategoryRepository: ISubServiceCategoryRepository
  ) {}

  async execute(
    payload: RequestToggleVerificationStatusOfSubServiceCategoryDTO
  ): Promise<void> {
    const { subServiceCategoryId, verificationStatus } = payload
    const subServiceCategoryExists =
      await this._subServiceCategoryRepository.findOne({ subServiceCategoryId })
    if (!subServiceCategoryExists) {
      throw new CustomError(
        'Sub Service Category Is Not Found',
        HTTP_STATUS.NOT_FOUND
      )
    }
    const oldStatus = subServiceCategoryExists.verification
    if (verificationStatus === oldStatus) {
      throw new CustomError(
        `State ${verificationStatus} already exists.`,
        HTTP_STATUS.CONFLICT
      )
    }
    const data = {
      verification: verificationStatus,
    }
    await this._subServiceCategoryRepository.update(
      { subServiceCategoryId },
      data
    )
  }
}
