import { inject, injectable } from 'tsyringe'
import { IFetchingCustomersStrategy } from '../../../strategies/commonFeatures/users/fetching_customers_strategy.interface'
import { IFetchingVendorsStrategy } from '../../../strategies/commonFeatures/users/fetching_vendors_strategy.interface'
import { IGetAllUsersFactory } from './get_all_users_factory.interface'
import { GetAllUsersDTO } from '../../../dtos/user_dto'
type SortField = 'name' | 'email' | 'createdAt';
type Status= 'all' | 'pending' | 'active' | 'blocked'
@injectable()
export class GetAllUsersFactory implements IGetAllUsersFactory {
  constructor(
    @inject('IFetchingCustomersStrategy')
    private _customerStrategy: IFetchingCustomersStrategy,

    @inject('IFetchingVendorsStrategy')
    private _vendorStrategy: IFetchingVendorsStrategy
  ) {}

  async getStrategy(
    role: string,
    page: number,
    limit: number,
    search: string,
    sortField: SortField,
    sortOrder: 'asc'| 'desc',
    status: Status
  ): Promise<GetAllUsersDTO> {
    switch (role.toLowerCase()) {
      case 'customer':
        return await this._customerStrategy.execute(page, limit, search, sortField, sortOrder, status)
      case 'vendor':
        return await this._vendorStrategy.execute(page, limit, search, sortField, sortOrder, status)
      default:
        throw new Error(`No users found for role: ${role}`)
    }
  }
}
