import { IVendorEntity } from '../../../domain/models/vendor_entity'
import { VendorRequestDTO } from '../../dtos/vendor_dto'

export class VendorRequestMapper {
  static toDTO(vendor: IVendorEntity): VendorRequestDTO {
    return {
      userId: vendor.userId || "",
      name: vendor.name,
      email: vendor.email,
      documents: Array.isArray(vendor.documents)
        ? vendor.documents.map((doc) => ({
          name: doc.name,
          url: doc.url,
        }))
        : [],
      isVerified: {
        status: vendor.isVerified?.status ?? 'pending',
        description: vendor.isVerified?.description ?? '',
      },
    }
  }

  static toDTOList(vendors: IVendorEntity[]): VendorRequestDTO[] {
    return vendors.map((vendor) => this.toDTO(vendor))
  }
}
