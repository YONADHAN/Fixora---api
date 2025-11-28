import { inject, injectable } from 'tsyringe'
import {
  RequestGetSingleSubServiceCategoryDTO,
  ResponseGetSingleSubServiceCategoryDTO,
} from '../../dtos/sub_service_category_dto'
import { CustomError } from '../../../domain/utils/custom.error'
import { HTTP_STATUS } from '../../../shared/constants'
import { ISubServiceCategoryRepository } from '../../../domain/repositoryInterfaces/feature/service/sub_service_catgory_repository.interface'
import { GetSingleSubServiceCategoryResponseMapper } from '../../mappers/sub_service_category/get_single_sub_service_category_mapper'
import { IGetSingleSubServiceCategoryUseCase } from '../../../domain/useCaseInterfaces/sub_service_category/get_single_sub_service_category_usecase.interface'

@injectable()
export class GetSingleSubServiceCategoryUseCase
  implements IGetSingleSubServiceCategoryUseCase
{
  constructor(
    @inject('ISubServiceCategoryRepository')
    private _subServiceCategoryRepository: ISubServiceCategoryRepository
  ) {}
  async execute(
    subServiceCategoryId: RequestGetSingleSubServiceCategoryDTO
  ): Promise<ResponseGetSingleSubServiceCategoryDTO> {
    console.log('entered here', subServiceCategoryId.subServiceCategoryId)
    const subServiceCategoryExists =
      await this._subServiceCategoryRepository.findOne({
        subServiceCategoryId: subServiceCategoryId.subServiceCategoryId,
      })
    console.log('subServiceCategoryExists', subServiceCategoryExists)
    if (!subServiceCategoryExists) {
      throw new CustomError(
        'Sub Service Category Is Not Existing',
        HTTP_STATUS.NOT_FOUND
      )
    }
    return GetSingleSubServiceCategoryResponseMapper.toDTO(
      subServiceCategoryExists
    )
  }
}
