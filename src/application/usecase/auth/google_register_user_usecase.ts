import { inject, injectable } from 'tsyringe'
import { GoogleUserDTO, SafeUserDTO } from '../../dtos/user_dto'
import { IGoogleRegistrationStrategyFactory } from '../../factories/auth/registration/google/google_registration_strategy_factory'
import { IGoogleRegisterUserUseCase } from '../../../domain/useCaseInterfaces/auth/google_register_user_usecase_interface'
import { IUserMapperFactory } from '../../mappers/mapper_factories/user_mapper_factory'

@injectable()
export class GoogleRegisterUserUseCase implements IGoogleRegisterUserUseCase {
  constructor(
    @inject('IGoogleRegistrationStrategyFactory')
    private _googleStrategyFactory: IGoogleRegistrationStrategyFactory,

    @inject('IUserMapperFactory')
    private _userMapperFactory: IUserMapperFactory
  ) {}

  async execute(user: GoogleUserDTO): Promise<SafeUserDTO> {
    const strategy = this._googleStrategyFactory.getStrategy(user.role)
    const createdUser = await strategy.register(user)

    const mapper = this._userMapperFactory.getMapper(user.role)
    return mapper.toDTO(createdUser)
  }
}
