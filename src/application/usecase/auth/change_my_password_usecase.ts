import { inject, injectable } from 'tsyringe'
import { IChangeMyPasswordUseCase } from '../../../domain/useCaseInterfaces/auth/change_my_password_usecase_interface'
import { IChangePasswordFactory } from '../../factories/auth/change_password/change_password_strategy_factory.interface'
@injectable()
export class ChangeMyPasswordUseCase implements IChangeMyPasswordUseCase {
  constructor(
    @inject('IChangePasswordFactory')
    private _changePasswordFactory: IChangePasswordFactory
  ) {}

  async execute(
    currentPassword: string,
    newPassword: string,
    userId: string,
    role: string
  ) {
    return await this._changePasswordFactory.execute(
      currentPassword,
      newPassword,
      userId,
      role
    )
  }
}
