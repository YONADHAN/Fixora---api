import { inject, injectable } from 'tsyringe'
import { IFetchingCustomersStrategy } from './fetching_customers_strategy.interface'
import { ICustomerRepository } from '../../../../domain/repositoryInterfaces/users/customer_repository.interface'
import { CustomError } from '../../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../../shared/constants'
import { UserMapper } from '../../../../application/mappers/admin/users.mapper'
import { GetAllUsersDTO } from '../../../../application/dtos/user_dto'

type SortField = 'name' | 'email' | 'createdAt';
type Status= 'all' | 'pending' | 'active' | 'blocked'
@injectable()
export class FetchingCustomersStrategy implements IFetchingCustomersStrategy {
  constructor(
    @inject('ICustomerRepository')
    private _customerRepository: ICustomerRepository
  ) {}

  async execute(
    page: number,
    limit: number,
    search: string,
    sortField: SortField,
    sortOrder: 'asc'|'desc',
    status: Status
  ): Promise<GetAllUsersDTO> {
    const response = await this._customerRepository.findCustomersWithFilters(
    {  page,
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

    const mappedCustomers = UserMapper.toResponse(response)

    return mappedCustomers
  }
}
