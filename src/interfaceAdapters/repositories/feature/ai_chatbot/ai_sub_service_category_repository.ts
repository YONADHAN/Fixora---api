import { inject, injectable } from 'tsyringe'
import { IAiSubServiceCategoryRepository } from '../../../../domain/repositoryInterfaces/feature/ai/ai_sub_service_repository.interface'
import { ISubServiceCategoryRepository } from '../../../../domain/repositoryInterfaces/feature/service/sub_service_catgory_repository.interface'

@injectable()
export class AiSubServiceCategoryRepository implements IAiSubServiceCategoryRepository {
  constructor(
    @inject('ISubServiceCategoryRepository')
    private readonly subServiceCategoryRepository: ISubServiceCategoryRepository,
  ) {}

  async getSubServiceCategories(params?: {
    serviceCategoryId?: string
    onlyActive?: boolean
  }) {
    const { serviceCategoryId, onlyActive = true } = params ?? {}

    const subCategories =
      await this.subServiceCategoryRepository.findAllDocsWithoutPagination({
        ...(onlyActive ? { isActive: true } : {}),
        ...(serviceCategoryId ? { serviceCategoryRef: serviceCategoryId } : {}),
      })

    return subCategories.map((sc) => ({
      subServiceCategoryId: sc.subServiceCategoryId,
      name: sc.name,
      description: sc.description,
      serviceCategoryName: sc.serviceCategory?.name,
    }))
  }
}
