import { GetAllUsersDTO } from '../../../dtos/user_dto'

export interface IGetAllUsersFactory {
 getStrategy(
    role: string,
    page: number,
    limit: number,
    search: string,
    sortField: string,
    sortOrder: 'asc'| 'desc',
    status: string
  ): Promise<GetAllUsersDTO> 
}
