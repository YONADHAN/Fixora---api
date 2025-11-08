import { inject, injectable } from 'tsyringe'
import { OAuth2Client } from 'google-auth-library'
import { config } from '../../../shared/config'
import { GoogleRegisterUserUseCase } from './google_register_user_usecase'
import { GoogleUserDTO } from '../../dtos/user_dto'
import { CustomError } from '../../../domain/utils/custom.error'
import { HTTP_STATUS } from '../../../shared/constants'
import { IGoogleUseCase } from '../../../domain/useCaseInterfaces/auth/google_usecase.interface'

@injectable()
export class GoogleLoginUseCase implements IGoogleUseCase {
  private _client: OAuth2Client

  constructor(
    @inject('IGoogleRegisterUserUseCase')
    private _googleRegisterUseCase: GoogleRegisterUserUseCase
  ) {
    this._client = new OAuth2Client(config.googleAuth.GOOGLE_CLIENT_ID)
  }

  async execute(credential: string, client_id: string, role: string) {
    if (!['customer', 'vendor'].includes(role)) {
      throw new CustomError(
        'Google login not supported for this role',
        HTTP_STATUS.BAD_REQUEST
      )
    }

    const ticket = await this._client.verifyIdToken({
      idToken: credential,
      audience: client_id,
    })

    const payload = ticket.getPayload()
    if (!payload)
      throw new CustomError('Invalid Google token', HTTP_STATUS.UNAUTHORIZED)

    const user: GoogleUserDTO = {
      name: payload.name || '',
      email: payload.email || '',
      googleId: payload.sub || '',
      role: role as 'customer' | 'vendor',
    }

    return await this._googleRegisterUseCase.execute(user)
  }
}
