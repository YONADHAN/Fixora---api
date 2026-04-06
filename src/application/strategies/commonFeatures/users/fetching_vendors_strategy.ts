import { inject, injectable } from 'tsyringe'
import { IFetchingVendorsStrategy } from './fetching_vendors_strategy.interface'
import { IVendorRepository } from '../../../../domain/repositoryInterfaces/users/vendor_repository.interface'
import { CustomError } from '../../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../../shared/constants'
import { UserMapper } from '../../../../application/mappers/admin/users.mapper'
import { GetAllUsersDTO } from '../../../../application/dtos/user_dto'
type SortField = 'name' | 'email' | 'createdAt';
type Status= 'all' | 'pending' | 'active' | 'blocked'
@injectable()
export class FetchingVendorsStrategy implements IFetchingVendorsStrategy {
  constructor(
    @inject('IVendorRepository')
    private _vendorRepository: IVendorRepository
  ) {}

  async execute(
    page: number,
    limit: number,
    search: string,
    sortField: SortField,
    sortOrder: 'asc'|'desc',
    status: Status,
  ): Promise<GetAllUsersDTO> {
    const response = await this._vendorRepository.findVendorsWithFilters(
     { page,
      limit,
      search,
      sortField,
      sortOrder,
      status}
    )

    if (!response || response.data.length === 0) {
      throw new CustomError(
        ERROR_MESSAGES.USERS_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      )
    }

    const mappedVendors = UserMapper.toResponse(response)
    return mappedVendors
  }
}
