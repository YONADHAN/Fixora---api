import { inject, injectable } from 'tsyringe'
import { ICustomerGoogleRegistrationStrategy } from './customer_google_registration_strategy.interface'
import { CustomerDTO, GoogleUserDTO } from '../../../../dtos/user_dto'
import { ICustomerEntity } from '../../../../../domain/models/customer_entity'
import { ICustomerRepository } from '../../../../../domain/repositoryInterfaces/users/customer_repository.interface'
import { generateUniqueId } from '../../../../../shared/utils/unique_uuid.helper'

@injectable()
export class CustomerGoogleRegistrationStrategy
  implements ICustomerGoogleRegistrationStrategy
{
  constructor(
    @inject('ICustomerRepository') private _customerRepo: ICustomerRepository
  ) {}

  async register(user: GoogleUserDTO): Promise<ICustomerEntity> {
    const existingUser = await this._customerRepo.findOne({ email: user.email })
    if (existingUser) {
      return existingUser
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
