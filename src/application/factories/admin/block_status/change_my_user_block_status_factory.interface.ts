import { statusTypes, TRole } from '../../../../shared/constants'
import { ChangeUserBlockStatusResponseDTO } from '../../../dtos/admin/change_my_user_block_status_dto'

export interface IChangeMyUserBlockStatusFactory {
  getStrategy(params: {
    role: TRole
    userId: string
    status: statusTypes
  }): Promise<ChangeUserBlockStatusResponseDTO>
}
