import { EditAddressRequestDTO } from '../../../application/dtos/address_dto'

export interface IEditAddressUseCase {
  execute(validatedDTO: EditAddressRequestDTO): Promise<void>
}
