import { SetDefaultAddressRequestDTO } from '../../../application/dtos/address_dto'

export interface ISetDefaultAddressUseCase {
  execute(validatedDTO: SetDefaultAddressRequestDTO): Promise<void>
}
