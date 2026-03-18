import { inject, injectable } from 'tsyringe'
import { ICustomerRepository } from '../../../../domain/repositoryInterfaces/users/customer_repository.interface'
import { CustomerProfileMapper } from '../../../mappers/customer/customer_profile_mapper'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../../shared/constants'
import { ICustomerProfileStrategy } from './customer_profile_strategy.interface'
import {
  CustomerProfileInfoDTO,
  VendorProfileInfoDTO,
} from '../../../dtos/user_dto'
import { CustomError } from '../../../../domain/utils/custom.error'

@injectable()
export class CustomerProfileStrategy implements ICustomerProfileStrategy {
  constructor(
    @inject('ICustomerRepository')
    private _CustomerRepository: ICustomerRepository
  ) {}

  async execute(params: {
    userId: string
  }): Promise<CustomerProfileInfoDTO | VendorProfileInfoDTO> {
    const { userId } = params
    const data = await this._CustomerRepository.findOne({ userId })
    if (!data) throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND,HTTP_STATUS.NOT_FOUND)
    return CustomerProfileMapper.toDTO(data)
  }
}
