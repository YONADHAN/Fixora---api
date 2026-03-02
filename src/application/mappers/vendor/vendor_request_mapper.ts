import { VendorRequestDTO } from '../../dtos/vendor_dto'

export class VendorRequestMapper {
  static toDTO(vendor: any): VendorRequestDTO {
    return {
      userId: vendor.userId,
      name: vendor.name,
      email: vendor.email,
      documents: Array.isArray(vendor.documents)
        ? vendor.documents.map((doc: any) => ({
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

  static toDTOList(vendors: any[]): VendorRequestDTO[] {
    return vendors.map((vendor) => this.toDTO(vendor))
  }
}
