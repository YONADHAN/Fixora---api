import { inject, injectable } from 'tsyringe'

import { IAddressRepository } from '../../../domain/repositoryInterfaces/feature/address/address_repository.interface'
import { CustomError } from '../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../shared/constants'
import { SetDefaultAddressRequestDTO } from '../../dtos/address_dto'
import { ISetDefaultAddressUseCase } from '../../../domain/useCaseInterfaces/address/set_default_address_usecase_interface'

@injectable()
export class SetDefaultAddressUseCase implements ISetDefaultAddressUseCase {
  constructor(
    @inject('IAddressRepository')
    private readonly _addressRepository: IAddressRepository
  ) {}
  async execute(validatedDTO: SetDefaultAddressRequestDTO): Promise<void> {
    const address = await this._addressRepository.findOne({
      addressId: validatedDTO.addressId,
    })
    if (!address) {
      throw new CustomError(
        ERROR_MESSAGES.ADDRESS_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      )
    }
    await this._addressRepository.clearDefaultAddress(address.customerId)
    await this._addressRepository.update(
      { customerId: address.customerId },
      { isDefault: true }
    )
  }
}
