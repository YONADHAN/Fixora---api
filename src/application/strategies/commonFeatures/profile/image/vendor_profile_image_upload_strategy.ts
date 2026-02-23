import { inject, injectable } from 'tsyringe'
import { IVendorProfileImageUploadStrategy } from './vendor_profile_image_upload_strategy.interface'
import { IVendorRepository } from '../../../../../domain/repositoryInterfaces/users/vendor_repository.interface'

@injectable()
export class VendorProfileImageUploadStrategy
  implements IVendorProfileImageUploadStrategy
{
  constructor(
    @inject('IVendorRepository')
    private vendorRepository: IVendorRepository
  ) {}

  async execute(params: { userId: string; imageUrl: string }): Promise<void> {
    const { userId, imageUrl } = params

    await this.vendorRepository.update(
      { userId },
      {
        profileImage: imageUrl,
        updatedAt: new Date(),
      }
    )
  }
}
