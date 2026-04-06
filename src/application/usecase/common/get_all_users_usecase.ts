import { inject, injectable } from 'tsyringe'

import { IGetAllUsersFactory } from '../../factories/commonFeatures/users/get_all_users_factory.interface'
import { IGetAllUsersUseCase } from '../../../domain/useCaseInterfaces/common/get_all_users_usecase_interface'

type SortField = 'name' | 'email' | 'createdAt';
type Status= 'all' | 'pending' | 'active' | 'blocked'
@injectable()
export class GetAllUsersUseCase implements IGetAllUsersUseCase {
  constructor(
    @inject('IGetAllUsersFactory')
    private _getAllUsersFactory: IGetAllUsersFactory
  ) {}

  async execute({
    role,
    page,
    limit,
    search,
    sortField,
    sortOrder,
    status
  }: {
    role: string
    page: number
    limit: number
    search: string
    sortField: SortField
    sortOrder: 'asc'|'desc'
    status: Status
  }) {
    return await this._getAllUsersFactory.getStrategy(role, page, limit, search, sortField, sortOrder, status)
  }
}
