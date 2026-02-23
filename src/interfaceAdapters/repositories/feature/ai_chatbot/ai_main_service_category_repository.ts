import { inject, injectable } from 'tsyringe'
import { IServiceCategoryRepository } from '../../../../domain/repositoryInterfaces/feature/service/service_category_repository.interface'
import { IAIMainServiceCategoryRepository } from '../../../../domain/repositoryInterfaces/feature/ai/ai_service_category_repository.interface'
import { IServiceCategoryEntity } from '../../../../domain/models/service_category_entity'

@injectable()
export class AIMainServiceCategoryRepository implements IAIMainServiceCategoryRepository {
  constructor(
    @inject('IServiceCategoryRepository')
    private readonly _serviceCategoryRepo: IServiceCategoryRepository,
  ) {}

  async findServiceCategories(): Promise<IServiceCategoryEntity[]> {
    const categories = await this._serviceCategoryRepo.findActiveCategories()

    return categories
  }
}
