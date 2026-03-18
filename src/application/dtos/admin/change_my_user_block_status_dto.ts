import { statusTypes } from "../../../shared/constants"

type UserStatusDTO = {
  userId: string
  status: statusTypes
}

export interface ChangeUserBlockStatusResponseDTO {
  message: string
  user: UserStatusDTO
}