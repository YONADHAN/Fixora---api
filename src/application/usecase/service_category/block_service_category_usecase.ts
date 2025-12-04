import { inject, injectable } from 'tsyringe'
import { HTTP_STATUS } from '../../../shared/constants'
import { CustomError } from '../../../domain/utils/custom.error'
import { IServiceCategoryRepository } from '../../../domain/repositoryInterfaces/feature/service/service_category_repository.interface'
import { IBlockServiceCategoryUseCase } from '../../../domain/useCaseInterfaces/service_category/block_service_category_usecase.interface'

@injectable()
export class BlockServiceCategoryUseCase
  implements IBlockServiceCategoryUseCase
{
  constructor(
    @inject('IServiceCategoryRepository')
    private _serviceCategoryRepository: IServiceCategoryRepository
  ) {}

  async execute(categoryId: string, status: string) {
    console.log(
      'The data arrived on the backend usecase block service category usecase ,',
      categoryId,
      ' and the status is ',
      status
    )
    const category = await this._serviceCategoryRepository.findOne({
      serviceCategoryId: categoryId,
    })

    if (!category) {
      throw new CustomError("Can't find the Category", HTTP_STATUS.NOT_FOUND)
    }

    const isActive = status === 'active'

    await this._serviceCategoryRepository.update(
      { serviceCategoryId: categoryId },
      { isActive }
    )

    return { success: true, message: 'Category updated successfully' }
  }
}
