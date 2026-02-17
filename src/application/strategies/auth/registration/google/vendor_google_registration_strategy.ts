import { inject, injectable } from 'tsyringe'
import { IVendorGoogleRegistrationStrategy } from './vendor_google_registration_strategy.interface'
import { GoogleUserDTO, VendorDTO } from '../../../../dtos/user_dto'
import { IVendorEntity } from '../../../../../domain/models/vendor_entity'
import { IVendorRepository } from '../../../../../domain/repositoryInterfaces/users/vendor_repository.interface'
import { generateUniqueId } from '../../../../../shared/utils/unique_uuid.helper'
import { IUserExistenceService } from '../../../../../domain/serviceInterfaces/user_existence_service.interface'
import { CustomError } from '../../../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../../../shared/constants'

@injectable()
export class VendorGoogleRegistrationStrategy
  implements IVendorGoogleRegistrationStrategy
{
  constructor(
    @inject('IVendorRepository') private _vendorRepo: IVendorRepository,
      @inject('IUserExistenceService')
        private _userExistenceService: IUserExistenceService,
  ) {}

  async register(user: GoogleUserDTO): Promise<IVendorEntity> {
    const existingUser = await this._vendorRepo.findOne({ email: user.email })
    if (existingUser) {
      return existingUser
    }
     const normalizedEmail = user.email.toLowerCase()
        const isEmailExisting =
          await this._userExistenceService.emailExists(normalizedEmail)
        if (isEmailExisting) {
          throw new CustomError(ERROR_MESSAGES.EMAIL_EXISTS, HTTP_STATUS.CONFLICT)
        }
    const newUser: Partial<IVendorEntity> = {
      userId: generateUniqueId(),
      name: user.name,
      email: user.email,
      googleId: user.googleId,
      role: 'vendor',
      status: 'active',
      phone: '',
      password: '',
      isVerified: user?.isVerified,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return this._vendorRepo.save(newUser)
  }
}
