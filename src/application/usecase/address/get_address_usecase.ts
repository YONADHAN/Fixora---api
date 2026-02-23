import { inject, injectable } from 'tsyringe'
import { IAddressRepository } from '../../../domain/repositoryInterfaces/feature/address/address_repository.interface'
import { ICustomerRepository } from '../../../domain/repositoryInterfaces/users/customer_repository.interface'
import { CustomError } from '../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../shared/constants'
import {
  GetAddressRequestDTO,
  GetAddressResponseDTO,
} from '../../dtos/address_dto'
import { GetAddressResponseMapper } from '../../mappers/address/get_addresses_mapper'
import { IGetAddressUseCase } from '../../../domain/useCaseInterfaces/address/get_address_usecase_interface'

@injectable()
export class GetAddressUseCase implements IGetAddressUseCase {
  constructor(
    @inject('IAddressRepository')
    private readonly _addressRepository: IAddressRepository,
    @inject('ICustomerRepository')
    private readonly _customerRepository: ICustomerRepository
  ) {}

  async execute(
    validatedDTO: GetAddressRequestDTO
  ): Promise<GetAddressResponseDTO> {
    const { page, limit, search = '', customerId } = validatedDTO
    const customer = await this._customerRepository.findOne({
      userId: customerId,
    })
    if (!customer) {
      throw new CustomError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      )
    }
    const unfilteredResponse =
      await this._addressRepository.findAddressByCustomerId(
        page,
        limit,
        search,
        { customerId: customerId, isActive: true }
      )

    const data = GetAddressResponseMapper.toDTO(unfilteredResponse)
    return data
  }
}
