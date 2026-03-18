import { ChangeUserBlockStatusResponseDTO } from '../../../application/dtos/admin/change_my_user_block_status_dto'
import { statusTypes, TRole } from '../../../shared/constants'

export interface IChangeMyUserBlockStatusUseCase {
  execute({
    role,
    userId,
    status,
  }: {
    role: TRole
    userId: string
    status: statusTypes
  }): Promise<ChangeUserBlockStatusResponseDTO>
}
