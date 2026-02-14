import {
  GetSingleAddressRequestDTO,
  GetSingleAddressResponseDTO,
} from '../../../application/dtos/address_dto'

export interface IGetSingleAddressUseCase {
  execute(
    validatedDTO: GetSingleAddressRequestDTO
  ): Promise<GetSingleAddressResponseDTO>
}
