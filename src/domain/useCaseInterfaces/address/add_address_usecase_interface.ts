import { AddAddressRequestDTO } from '../../../application/dtos/address_dto'

export interface IAddAddressUseCase {
  execute(validatedDTO: AddAddressRequestDTO): Promise<void>
}
