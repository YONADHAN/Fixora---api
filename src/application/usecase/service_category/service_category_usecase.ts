import { inject, injectable } from 'tsyringe'

import { IServiceCategoryRepository } from '../../../domain/repositoryInterfaces/feature/service/service_category_repository.interface'
import { IGetAllServiceCategoryUseCase } from '../../../domain/useCaseInterfaces/service/service_category_usecase.interface'
import {
  RequestServiceCategoryDTO,
  ResponseServiceCategoryDTO,
} from '../../dtos/service_category_dto'
import { ServiceCategoryMapper } from '../../mappers/service_category/service_category_mapper'

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
  }: RequestServiceCategoryDTO): Promise<ResponseServiceCategoryDTO> {
    const response = await this._serviceCategoryRepository.findAllDocuments(
      page,
      limit,
      search
    )
    const result = ServiceCategoryMapper.toDTO(response)
    return result
  }
}
