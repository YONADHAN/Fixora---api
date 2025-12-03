import { inject, injectable } from 'tsyringe'
import { IServiceRepository } from '../../../domain/repositoryInterfaces/feature/service/service_repository.interface'
import {
  RequestGetAllServicesDTO,
  ResponseGetAllServicesDTO,
} from '../../dtos/service_dto'
import { GetAllServicesResponseMapper } from '../../mappers/service/get_all_service_mapper'
import { IGetAllServicesUseCase } from '../../../domain/useCaseInterfaces/service/get_all_services_usecase.interface'
import { IVendorRepository } from '../../../domain/repositoryInterfaces/users/vendor_repository.interface'
import { CustomError } from '../../../domain/utils/custom.error'
import { HTTP_STATUS } from '../../../shared/constants'

@injectable()
export class GetAllServicesUseCase implements IGetAllServicesUseCase {
  constructor(
    @inject('IServiceRepository')
    private _serviceRepo: IServiceRepository,
    @inject('IVendorRepository')
    private _vendorRepo: IVendorRepository
  ) {}

  async execute(
    payload: RequestGetAllServicesDTO
  ): Promise<ResponseGetAllServicesDTO> {
    const { page, limit, search = '', vendorId } = payload
    const vendorServiceExists = await this._vendorRepo.findOne({
      userId: vendorId,
    })
    if (!vendorServiceExists) {
      throw new CustomError('Vendor is not valid', HTTP_STATUS.BAD_REQUEST)
    }
    const entity = await this._serviceRepo.findAllDocumentsWithFilteration(
      page,
      limit,
      search,
      { vendorRef: vendorServiceExists._id }
    )

    const response = GetAllServicesResponseMapper.toDTO(entity)

    return response
  }
}
