import { CustomerDTO, GoogleUserDTO } from '../../../../dtos/user_dto'
import { ICustomerEntity } from '../../../../../domain/models/customer_entity'

export interface ICustomerGoogleRegistrationStrategy {
  register(user: GoogleUserDTO): Promise<ICustomerEntity>
}
