import { DeleteaddressDTO } from '../../../application/dtos/address_dto'

export interface IDeleteAddressUseCase {
  execute(validatedDTO: DeleteaddressDTO): Promise<void>
}
