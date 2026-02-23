import { inject, injectable } from 'tsyringe'
import { ISubServiceCategoryRepository } from '../../../domain/repositoryInterfaces/feature/service/sub_service_catgory_repository.interface'
import { GetActiveSubServiceCategoriesResponseMapper } from '../../mappers/sub_service_category/get_active_sub_service_categories_mapper'
import { CustomError } from '../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../shared/constants'
import { ResponseGetActiveSubServiceCategoriesDTO } from '../../dtos/sub_service_category_dto'
import { IGetActiveSubServiceCategoriesUseCase } from '../../../domain/useCaseInterfaces/sub_service_category/get_active_sub_service_categories_usecase'
@injectable()
export class GetActiveSubServiceCategoriesUseCase
  implements IGetActiveSubServiceCategoriesUseCase
{
  constructor(
    @inject('ISubServiceCategoryRepository')
    private _subServiceCategoryRepository: ISubServiceCategoryRepository
  ) {}

  async execute(): Promise<ResponseGetActiveSubServiceCategoriesDTO> {
    const response =
      await this._subServiceCategoryRepository.findAllDocsWithoutPagination({
        isActive: 'active',
        verification: 'accepted',
      })

    if (!response || response.length === 0) {
      throw new CustomError(
        ERROR_MESSAGES.SUB_SERVICES_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      )
    }

    return {
      data: GetActiveSubServiceCategoriesResponseMapper.toDTO(response),
    }
  }
}
