import { inject, injectable } from 'tsyringe'
import { ICustomerProfileImageUploadStrategy } from './customer_profile_image_upload_strategy.interface'
import { ICustomerRepository } from '../../../../../domain/repositoryInterfaces/users/customer_repository.interface'

@injectable()
export class CustomerProfileImageUploadStrategy
  implements ICustomerProfileImageUploadStrategy
{
  constructor(
    @inject('ICustomerRepository')
    private customerRepository: ICustomerRepository
  ) {}

  async execute(params: { userId: string; imageUrl: string }): Promise<void> {
    const { userId, imageUrl } = params

    await this.customerRepository.update(
      { userId },
      {
        profileImage: imageUrl,
        updatedAt: new Date(),
      }
    )
  }
}
