import { ICustomerEntity } from '../../../domain/models/customer_entity'
import { SafeUserDTO } from '../../dtos/user_dto'
import { IUserMapper } from '../mapper_factories/user_mapper_factory'
import { injectable } from 'tsyringe'

@injectable()
export class CustomerSafeMapper implements IUserMapper {
  toDTO(customer: ICustomerEntity): SafeUserDTO {
    return {
      userId: customer.userId ?? '',
      name: customer.name,
      email: customer.email,
      role: 'customer',
      phone: customer.phone,
      location: customer.location,
    }
  }
}
