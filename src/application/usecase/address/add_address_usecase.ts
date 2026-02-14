import { inject, injectable } from 'tsyringe'
import { IAddressRepository } from '../../../domain/repositoryInterfaces/feature/address/address_repository.interface'
import { generateUniqueId } from '../../../shared/utils/unique_uuid.helper'
import { AddAddressRequestDTO } from '../../dtos/address_dto'
import { IAddAddressUseCase } from '../../../domain/useCaseInterfaces/address/add_address_usecase_interface'

@injectable()
export class AddAddressUseCase implements IAddAddressUseCase {
  constructor(
    @inject('IAddressRepository')
    private readonly _addressRepository: IAddressRepository
  ) {}

  async execute(validatedDTO: AddAddressRequestDTO): Promise<void> {
    const addressId = generateUniqueId()

    const data = {
      ...validatedDTO,
      addressId,
      isActive: true,
    }

    if (validatedDTO.isDefault) {
      await this._addressRepository.clearDefaultAddress(validatedDTO.customerId)
    }

    await this._addressRepository.save(data)
  }
}
