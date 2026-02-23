import { injectable, inject } from 'tsyringe'
import { IVendorRepository } from '../../../../domain/repositoryInterfaces/users/vendor_repository.interface'
import { CustomError } from '../../../../domain/utils/custom.error'
import { HTTP_STATUS } from '../../../../shared/constants'
import { IGetAllVendorRequestsUseCase } from '../../../../domain/useCaseInterfaces/admin/get_all_vendor_requests_usecase_interface'
import { VendorRequestMapper } from '../../../mappers/vendor/vendor_request_mapper'
import { VendorRequestDTO } from '../../../dtos/vendor_dto'

@injectable()
export class GetAllVendorRequestsUseCase
  implements IGetAllVendorRequestsUseCase
{
  constructor(
    @inject('IVendorRepository')
    private _vendorRepository: IVendorRepository
  ) {}

  async execute({
    page,
    limit,
    search,
  }: {
    page: number
    limit: number
    search: string
  }): Promise<{ data: VendorRequestDTO[]; total: number; totalPages: number }> {
    const vendors = await this._vendorRepository.findAll(page, limit, search)

    if (!vendors || vendors.length === 0) {
      throw new CustomError('No vendor requests found', HTTP_STATUS.NOT_FOUND)
    }

    const dtoList = VendorRequestMapper.toDTOList(vendors)

    const total = vendors.length
    const totalPages = Math.ceil(total / limit)

    return {
      data: dtoList,
      total,
      totalPages,
    }
  }
}
