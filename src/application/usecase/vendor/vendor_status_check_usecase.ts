import { injectable, inject } from 'tsyringe'
import { IVendorRepository } from '../../../domain/repositoryInterfaces/users/vendor_repository.interface'
import {
  IVendorStatusCheckUseCase,
  VendorVerificationStatus,
} from '../../../domain/useCaseInterfaces/vendor/vendor_status_check_usecase.interface'

@injectable()
export class VendorStatusCheckUsecase implements IVendorStatusCheckUseCase {
  constructor(
    @inject('IVendorRepository')
    private _vendorRepository: IVendorRepository
  ) {}

  async execute(userId: string): Promise<VendorVerificationStatus> {
    const vendor = await this._vendorRepository.findOne({ userId })
    if (!vendor) throw new Error('Vendor not found')

    const isVerified = vendor.isVerified || {}

    const verified: VendorVerificationStatus = {
      status:
        isVerified.status === 'accepted' ||
        isVerified.status === 'rejected' ||
        isVerified.status === 'pending'
          ? isVerified.status
          : 'pending',
      description: isVerified.description ?? '',
      reviewedBy: {
        adminId: isVerified.reviewedBy?.adminId ?? null,
        reviewedAt: isVerified.reviewedBy?.reviewedAt ?? undefined,
      },
      documentCount: vendor.documents?.length || 0,
    }

    return verified
  }
}
