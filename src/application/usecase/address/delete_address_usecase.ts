import { inject, injectable } from 'tsyringe'
import { IAddressRepository } from '../../../domain/repositoryInterfaces/feature/address/address_repository.interface'
import { DeleteaddressDTO } from '../../dtos/address_dto'
import { CustomError } from '../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../shared/constants'
import { IDeleteAddressUseCase } from '../../../domain/useCaseInterfaces/address/delete_address_usecase_interface'

@injectable()
export class DeleteAddressUseCase implements IDeleteAddressUseCase {
  constructor(
    @inject('IAddressRepository')
    private readonly _addressRepository: IAddressRepository
  ) {}
  async execute(validatedDTO: DeleteaddressDTO): Promise<void> {
    const address = await this._addressRepository.findOne({
      addressId: validatedDTO.addressId,
    })
    if (!address) {
      throw new CustomError(
        ERROR_MESSAGES.ADDRESS_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      )
    }
    await this._addressRepository.update(
      { addressId: validatedDTO.addressId },
      { isActive: false }
    )
  }
}
