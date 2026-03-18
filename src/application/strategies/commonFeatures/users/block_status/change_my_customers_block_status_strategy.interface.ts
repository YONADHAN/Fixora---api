import { statusTypes } from '../../../../../shared/constants'
import { ChangeUserBlockStatusResponseDTO } from '../../../../dtos/admin/change_my_user_block_status_dto'

export interface IChangeMyCustomersBlockStatusStrategy {
  execute(userId: string, status: statusTypes): Promise<ChangeUserBlockStatusResponseDTO>
}
