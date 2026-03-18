import { ICustomerEntity } from '../../../domain/models/customer_entity'
import { CustomerProfileInfoDTO } from '../../dtos/user_dto'

export class CustomerProfileMapper {
  static toDTO(customer: ICustomerEntity): CustomerProfileInfoDTO {
    return {
      userId: customer.userId!,
      name: customer.name,
      email: customer.email,
      role: customer.role!,
      phone: customer.phone || '',
      status: customer.status!,
      profileImage: customer.profileImage,
      location: {
        name: customer.location?.name || '',
        displayName: customer.location?.displayName || '',
        zipCode: customer.location?.zipCode || '',
      },
    }
  }
}