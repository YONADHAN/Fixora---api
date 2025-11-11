import { inject, injectable } from 'tsyringe'
import bcrypt from 'bcryptjs'
import { ICustomerRepository } from '../../../../domain/repositoryInterfaces/users/customer_repository.interface'
import { CustomError } from '../../../../domain/utils/custom.error'
import { ERROR_MESSAGES } from '../../../../shared/constants'
import { IChangeCustomerPasswordStrategy } from './change_customer_password_strategy.interface'

@injectable()
export class ChangeCustomerPasswordStrategy
  implements IChangeCustomerPasswordStrategy
{
  constructor(
    @inject('ICustomerRepository')
    private _customerRepository: ICustomerRepository
  ) {}

  async execute(currentPassword: string, newPassword: string, userId: string) {
    const customer = await this._customerRepository.findOne({ userId })

    if (!customer) {
      throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, 404)
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      customer.password
    )
    if (!isPasswordValid) {
      throw new CustomError('Current password is invalid', 400)
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await this._customerRepository.update(
      { userId },
      { password: hashedPassword }
    )

    return { OK: true }
  }
}
