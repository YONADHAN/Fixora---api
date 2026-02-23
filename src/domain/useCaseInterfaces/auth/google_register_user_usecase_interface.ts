import { GoogleUserDTO, SafeUserDTO } from '../../../application/dtos/user_dto'

export interface IGoogleRegisterUserUseCase {
  execute(user: GoogleUserDTO): Promise<SafeUserDTO>
}
