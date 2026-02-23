import { inject, injectable } from 'tsyringe'
import { CustomError } from '../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../shared/constants'
import {
  GetSingleAddressRequestDTO,
  GetSingleAddressResponseDTO,
} from '../../dtos/address_dto'
import { IAddressRepository } from '../../../domain/repositoryInterfaces/feature/address/address_repository.interface'

import { GetSingleAddressResponseMapper } from '../../mappers/address/get_single_address_mapper'
import { IGetSingleAddressUseCase } from '../../../domain/useCaseInterfaces/address/get_single_address_usecase_interface'

@injectable()
export class GetSingleAddressUseCase implements IGetSingleAddressUseCase {
  constructor(
    @inject('IAddressRepository')
    private readonly _addressRepository: IAddressRepository
  ) {}
  async execute(
    validatedDTO: GetSingleAddressRequestDTO
  ): Promise<GetSingleAddressResponseDTO> {
    const address = await this._addressRepository.findOne({
      addressId: validatedDTO.addressId,
    })
    if (!address) {
      throw new CustomError(
        ERROR_MESSAGES.ADDRESS_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      )
    }
    return GetSingleAddressResponseMapper.toDTO(address)
  }
}
