import { inject, injectable } from 'tsyringe'

import { IServiceCategoryRepository } from '../../../domain/repositoryInterfaces/feature/service/service_category_repository.interface'
import { IGetAllServiceCategoryUseCase } from '../../../domain/useCaseInterfaces/service/service_category_usecase.interface'

@injectable()
export class GetAllServiceCategoryUseCase
  implements IGetAllServiceCategoryUseCase
{
  constructor(
    @inject('IServiceCategoryRepository')
    private _serviceCategoryRepository: IServiceCategoryRepository
  ) {}

  async execute({
    page,
    limit,
    search,
  }: {
    page: number
    limit: number
    search: string
  }) {
    return await this._serviceCategoryRepository.findAll(page, limit, search)
  }
}
