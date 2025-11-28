import { inject, injectable } from 'tsyringe'

import { IServiceCategoryRepository } from '../../../domain/repositoryInterfaces/feature/service/service_category_repository.interface'

import { ResponseActiveServiceCategoryDTO } from '../../dtos/service_category_dto'

import { ActiveServiceCategoryMapper } from '../../mappers/service_category/active_service_category_mapper'
import { IGetActiveServiceCategoryUseCase } from '../../../domain/useCaseInterfaces/service_category/active_service_category_usecase.interface'

@injectable()
export class GetActiveServiceCategoryUseCase
  implements IGetActiveServiceCategoryUseCase
{
  constructor(
    @inject('IServiceCategoryRepository')
    private _serviceCategoryRepository: IServiceCategoryRepository
  ) {}

  async execute(): Promise<ResponseActiveServiceCategoryDTO> {
    const response =
      await this._serviceCategoryRepository.findActiveCategories()
    return ActiveServiceCategoryMapper.toDTO(response)
  }
}
