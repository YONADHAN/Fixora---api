import { inject, injectable } from 'tsyringe'
import { IServiceCategoryRepository } from '../../../domain/repositoryInterfaces/feature/service/service_category_repository.interface'
import { IGetSingleServiceCategoryUseCase } from '../../../domain/useCaseInterfaces/service/single_service_category_usecase.interface'
import { toServiceCategoryDTO } from '../../mappers/admin/service_category.mapper'
import { ServiceCategoryResponseDTO } from '../../dtos/admin/service_category_dto'

@injectable()
export class GetSingleServiceCategoryUseCase
  implements IGetSingleServiceCategoryUseCase
{
  constructor(
    @inject('IServiceCategoryRepository')
    private _serviceCategoryRepository: IServiceCategoryRepository
  ) {}

  async execute({
    categoryId,
  }: {
    categoryId: string
  }): Promise<ServiceCategoryResponseDTO | null> {
    const entity = await this._serviceCategoryRepository.findOne({
      serviceCategoryId: categoryId,
    })

    if (!entity) return null

    return toServiceCategoryDTO(entity)
  }
}
