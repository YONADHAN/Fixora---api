import { IVendorEntity } from '../../../domain/models/vendor_entity'
import { VendorProfileInfoDTO } from '../../dtos/user_dto'

export class VendorProfileMapper {
  static toDTO(vendor: IVendorEntity): VendorProfileInfoDTO {
    return {
      userId: vendor.userId!,
      name: vendor.name,
      email: vendor.email,
      role: vendor.role!,
      phone: vendor.phone || '',
      status: vendor.status!,
      profileImage: vendor.profileImage,
      location: {
        name: vendor.location?.name|| '',
        displayName: vendor.location?.displayName|| '',
        zipCode: vendor.location?.zipCode|| ''
      },
    }
  }
}