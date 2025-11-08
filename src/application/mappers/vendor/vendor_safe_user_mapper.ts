import { IVendorEntity } from '../../../domain/models/vendor_entity'
import { SafeUserDTO } from '../../dtos/user_dto'
import { IUserMapper } from '../mapper_factories/user_mapper_factory'
import { injectable } from 'tsyringe'

@injectable()
export class VendorSafeMapper implements IUserMapper {
  toDTO(vendor: IVendorEntity): SafeUserDTO {
    return {
      userId: vendor.userId ?? '',
      name: vendor.name,
      email: vendor.email,
      role: 'vendor',
      phone: vendor.phone,
      location: vendor.location,
    }
  }
}
