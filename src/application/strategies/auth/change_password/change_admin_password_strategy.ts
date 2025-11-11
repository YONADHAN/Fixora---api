import { inject, injectable } from 'tsyringe'
import bcrypt from 'bcryptjs'
import { IAdminRepository } from '../../../../domain/repositoryInterfaces/users/admin_repository.interface'
import { CustomError } from '../../../../domain/utils/custom.error'
import { ERROR_MESSAGES } from '../../../../shared/constants'
import { IChangeAdminPasswordStrategy } from './change_admin_password_strategy.interface'

@injectable()
export class ChangeAdminPasswordStrategy
  implements IChangeAdminPasswordStrategy
{
  constructor(
    @inject('IAdminRepository')
    private _adminRepository: IAdminRepository
  ) {}

  async execute(currentPassword: string, newPassword: string, userId: string) {
    const admin = await this._adminRepository.findOne({ userId })

    if (!admin) {
      throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, 404)
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      admin.password
    )
    if (!isPasswordValid) {
      throw new CustomError('Current password is invalid', 400)
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await this._adminRepository.update({ userId }, { password: hashedPassword })

    return { OK: true }
  }
}
