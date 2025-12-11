import { inject, injectable } from 'tsyringe'

import { IServiceCategoryRepository } from '../../../domain/repositoryInterfaces/feature/service/service_category_repository.interface'

import { ResponseActiveServiceCategoriesDTO } from '../../dtos/service_category_dto'

import { ActiveServiceCategoryMapper } from '../../mappers/service_category/active_service_category_mapper'
import { IGetActiveServiceCategoriesUseCase } from '../../../domain/useCaseInterfaces/service_category/active_service_category_usecase.interface'

@injectable()
export class GetActiveServiceCategoriesUseCase
  implements IGetActiveServiceCategoriesUseCase
{
  constructor(
    @inject('IServiceCategoryRepository')
    private _serviceCategoryRepository: IServiceCategoryRepository
  ) {}

  async execute(): Promise<ResponseActiveServiceCategoriesDTO> {
    const response =
      await this._serviceCategoryRepository.findActiveCategories()
    return ActiveServiceCategoryMapper.toDTO(response)
  }
}
