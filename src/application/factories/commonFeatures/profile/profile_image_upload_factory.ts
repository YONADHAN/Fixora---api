import { inject, injectable } from 'tsyringe'
import { IProfileImageUploadFactory } from './profile_image_upload_factory.interface'
import { IVendorProfileImageUploadStrategy } from '../../../strategies/commonFeatures/profile/image/vendor_profile_image_upload_strategy.interface'
import { ICustomerProfileImageUploadStrategy } from '../../../strategies/commonFeatures/profile/image/customer_profile_image_upload_strategy.interface'

@injectable()
export class ProfileImageUploadFactory implements IProfileImageUploadFactory {
  constructor(
    @inject('IVendorProfileImageUploadStrategy')
    private vendorStrategy: IVendorProfileImageUploadStrategy,

    @inject('ICustomerProfileImageUploadStrategy')
    private customerStrategy: ICustomerProfileImageUploadStrategy
  ) {}

  async execute(role: string, userId: string, imageUrl: string) {
    switch (role.toLowerCase()) {
      case 'vendor':
        return this.vendorStrategy.execute({ userId, imageUrl })

      case 'customer':
        return this.customerStrategy.execute({ userId, imageUrl })

      default:
        throw new Error(
          `No profile image upload strategy found for role: ${role}`
        )
    }
  }
}
