import { inject, injectable } from 'tsyringe'
import bcrypt from 'bcryptjs'
import { IVendorRepository } from '../../../../domain/repositoryInterfaces/users/vendor_repository.interface'
import { CustomError } from '../../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../../shared/constants'
import { IChangeVendorPasswordStrategy } from './change_vendor_password_strategy.interface'

@injectable()
export class ChangeVendorPasswordStrategy
  implements IChangeVendorPasswordStrategy
{
  constructor(
    @inject('IVendorRepository')
    private _vendorRepository: IVendorRepository
  ) {}

  async execute(currentPassword: string, newPassword: string, userId: string) {
    const vendor = await this._vendorRepository.findOne({ userId })

    if (!vendor) {
      throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      vendor.password
    )
    if (!isPasswordValid) {
      throw new CustomError('Current password is invalid', HTTP_STATUS.BAD_REQUEST)
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await this._vendorRepository.update(
      { userId },
      { password: hashedPassword }
    )

    return { OK: true }
  }
}
