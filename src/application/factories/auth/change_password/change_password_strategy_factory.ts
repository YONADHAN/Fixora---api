import { inject, injectable } from 'tsyringe'
import { IChangePasswordFactory } from './change_password_strategy_factory.interface'
import { IChangeAdminPasswordStrategy } from '../../../strategies/auth/change_password/change_admin_password_strategy.interface'
import { IChangeVendorPasswordStrategy } from '../../../strategies/auth/change_password/change_vendor_password_strategy.interface'
import { IChangeCustomerPasswordStrategy } from '../../../strategies/auth/change_password/change_customer_password_strategy.interface'
import { CustomError } from '../../../../domain/utils/custom.error'
@injectable()
export class ChangePasswordFactory implements IChangePasswordFactory {
  constructor(
    @inject('IChangeAdminPasswordStrategy')
    private _changeAdminPasswordStrategy: IChangeAdminPasswordStrategy,
    @inject('IChangeVendorPasswordStrategy')
    private _changeVendorPasswordStrategy: IChangeVendorPasswordStrategy,
    @inject('IChangeCustomerPasswordStrategy')
    private _changeCustomerPasswordStrategy: IChangeCustomerPasswordStrategy
  ) {}

  async execute(
    currentPassword: string,
    newPassword: string,
    userId: string,
    role: string
  ) {
    switch (role) {
      case 'admin':
        return await this._changeAdminPasswordStrategy.execute(
          currentPassword,
          newPassword,
          userId
        )
      case 'vendor':
        return await this._changeVendorPasswordStrategy.execute(
          currentPassword,
          newPassword,
          userId
        )
      case 'customer':
        return await this._changeCustomerPasswordStrategy.execute(
          currentPassword,
          newPassword,
          userId
        )
      default:
        throw new CustomError('Invalid role provided', 400)
    }
  }
}
