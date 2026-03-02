import { inject, injectable } from 'tsyringe'
import { ICustomerGoogleRegistrationStrategy } from './customer_google_registration_strategy.interface'
import {  GoogleUserDTO } from '../../../../dtos/user_dto'
import { ICustomerEntity } from '../../../../../domain/models/customer_entity'
import { ICustomerRepository } from '../../../../../domain/repositoryInterfaces/users/customer_repository.interface'
import { generateUniqueId } from '../../../../../shared/utils/unique_uuid.helper'
import { IUserExistenceService } from '../../../../../domain/serviceInterfaces/user_existence_service.interface'
import { CustomError } from '../../../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../../../shared/constants'

@injectable()
export class CustomerGoogleRegistrationStrategy
  implements ICustomerGoogleRegistrationStrategy
{
  constructor(
    @inject('ICustomerRepository') 
    private _customerRepo: ICustomerRepository,
      @inject('IUserExistenceService')
        private _userExistenceService: IUserExistenceService,
  ) {}

  async register(user: GoogleUserDTO): Promise<ICustomerEntity> {
    const existingUser = await this._customerRepo.findOne({ email: user.email })
    if (existingUser) {
      return existingUser
    }
 const normalizedEmail = user.email.toLowerCase()
    const isEmailExisting =
      await this._userExistenceService.emailExists(normalizedEmail)
    if (isEmailExisting) {
      throw new CustomError(ERROR_MESSAGES.EMAIL_EXISTS, HTTP_STATUS.CONFLICT)
    }
    const newUser: Partial<ICustomerEntity> = {
      userId: generateUniqueId(),
      name: user.name,
      email: user.email,
      googleId: user.googleId,
      role: 'customer',
      status: 'active',
      phone: '',
      password: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return this._customerRepo.save(newUser)
  }
}
