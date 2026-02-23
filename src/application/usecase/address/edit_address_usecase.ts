import { inject, injectable } from 'tsyringe'
import { IAddressRepository } from '../../../domain/repositoryInterfaces/feature/address/address_repository.interface'
import { CustomError } from '../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../shared/constants'
import { EditAddressRequestDTO } from '../../dtos/address_dto'
import { IEditAddressUseCase } from '../../../domain/useCaseInterfaces/address/edit_address_usecase_interface'

@injectable()
export class EditAddressUseCase implements IEditAddressUseCase {
  constructor(
    @inject('IAddressRepository')
    private readonly _addressRepository: IAddressRepository
  ) {}
  async execute(validatedDTO: EditAddressRequestDTO): Promise<void> {
    const { addressId, ...dataToSave } = validatedDTO
    const address = await this._addressRepository.findOne({ addressId })
    if (!address) {
      throw new CustomError(
        ERROR_MESSAGES.ADDRESS_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      )
    }
    if (validatedDTO.isDefault) {
      await this._addressRepository.clearDefaultAddress(address.customerId)
    }
    await this._addressRepository.update({ addressId }, { ...dataToSave })
  }
}
