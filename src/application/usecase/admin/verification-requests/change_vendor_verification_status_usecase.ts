import { inject, injectable } from 'tsyringe'
import { IVendorRepository } from '../../../../domain/repositoryInterfaces/users/vendor_repository.interface'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../../shared/constants'
import { CustomError } from '../../../../domain/utils/custom.error'
import { IChangeVendorVerificationStatusUseCase } from '../../../../domain/useCaseInterfaces/admin/change_vendor_verification_status_usecase_interface'

@injectable()
export class ChangeVendorVerificationStatusUseCase
  implements IChangeVendorVerificationStatusUseCase
{
  constructor(
    @inject('IVendorRepository')
    private _vendorRepository: IVendorRepository
  ) {}

  async execute({
    userId,
    verificationStatus,
    adminId,
    description,
  }: {
    userId: string
    verificationStatus: 'accepted' | 'rejected'
    adminId: string
    description?: string
  }): Promise<{
    userId: string
    name: string
    status: 'accepted' | 'rejected'
    reviewedBy: { adminId: string; reviewedAt: Date }
    description: string
  }> {
    const vendor = await this._vendorRepository.findOne({ userId })
    if (!vendor) {
      throw new CustomError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      )
    }

    if (vendor.isVerified?.status === verificationStatus) {
      throw new CustomError(
        'Vendor already has this verification status',
        HTTP_STATUS.CONFLICT
      )
    }

    const reviewedAt = new Date()

    const finalDescription =
      verificationStatus === 'accepted'
        ? `Admin ${adminId} verified vendor ${
            vendor.userId ?? 'unknown'
          } documents successfully.`
        : description?.trim() || 'Rejected by admin.'

    vendor.isVerified = {
      status: verificationStatus,
      reviewedBy: { adminId, reviewedAt },
      description: finalDescription,
    }

    await this._vendorRepository.update({ userId }, vendor)

    return {
      userId: vendor.userId ?? '',
      name: vendor.name ?? '',
      status: verificationStatus,
      reviewedBy: { adminId, reviewedAt },
      description: finalDescription,
    }
  }
}
