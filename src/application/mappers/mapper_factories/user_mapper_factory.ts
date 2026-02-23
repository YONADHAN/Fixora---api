import { SafeUserDTO } from '../../dtos/user_dto'
import { ICustomerEntity } from '../../../domain/models/customer_entity'
import { IVendorEntity } from '../../../domain/models/vendor_entity'

export interface IUserMapper {
  toDTO(user: ICustomerEntity | IVendorEntity): SafeUserDTO
}

export interface IUserMapperFactory {
  getMapper(role: string): IUserMapper
}
