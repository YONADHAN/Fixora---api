import { GetAllUsersDTO } from '../../../../application/dtos/user_dto'
type SortField = 'name' | 'email' | 'createdAt';
type Status= 'all' | 'pending' | 'active' | 'blocked'
export interface IFetchingVendorsStrategy {
  execute(page: number, limit: number, search: string, sortField: SortField, sortOrder: 'asc'| 'desc', status: Status): Promise<GetAllUsersDTO>
}
