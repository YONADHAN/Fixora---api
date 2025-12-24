import {
  GetAddressRequestDTO,
  GetAddressResponseDTO,
} from '../../../application/dtos/address_dto'

export interface IGetAddressUseCase {
  execute(validatedDTO: GetAddressRequestDTO): Promise<GetAddressResponseDTO>
}
