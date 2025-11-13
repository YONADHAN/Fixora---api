import { inject, injectable } from 'tsyringe'
import { IVendorRepository } from '../../../../domain/repositoryInterfaces/users/vendor_repository.interface'
import { IStorageService } from '../../../../domain/serviceInterfaces/s3_storage_service_interface'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../../shared/constants'
import { CustomError } from '../../../../domain/utils/custom.error'
import { IChangeVendorVerificationStatusUseCase } from '../../../../domain/useCaseInterfaces/admin/change_vendor_verification_status_usecase_interface'
import { config } from '../../../../shared/config'

@injectable()
export class ChangeVendorVerificationStatusUseCase
  implements IChangeVendorVerificationStatusUseCase
{
  constructor(
    @inject('IVendorRepository')
    private _vendorRepository: IVendorRepository,

    @inject('IStorageService')
    private _storageService: IStorageService
  ) {}

  /**
   * Extract bucket and key from AWS S3 URL
   * Example: https://fixora-storage-yonadhan.s3.ap-south-1.amazonaws.com/vendor-verification-docs/abc123.png
   */
  private extractBucketAndKey(
    url: string
  ): { bucket: string; key: string } | null {
    try {
      // Example URL parts:
      //   domain = fixora-storage-yonadhan.s3.ap-south-1.amazonaws.com
      //   bucket = fixora-storage-yonadhan
      const match = url.match(
        /^https?:\/\/([^.]+)\.s3[.-][^/]+\.amazonaws\.com\/(.+)$/
      )
      if (!match) {
        console.warn('⚠️ Invalid AWS S3 URL format:', url)
        return null
      }

      const bucket = match[1] // fixora-storage-yonadhan
      const key = match[2] // vendor-verification-docs/abc123.png

      return { bucket, key }
    } catch (err) {
      console.error(' Failed to extract bucket/key from S3 URL:', url, err)
      return null
    }
  }

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
    console.log('entered the change vendor verification status usecase')

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

    /**
     * 🔴 If rejected → delete all uploaded documents from MinIO + clear MongoDB
     */
    if (verificationStatus === 'rejected' && Array.isArray(vendor.documents)) {
      console.log(
        `Deleting ${vendor.documents.length} vendor docs from MinIO...`
      )
      for (const doc of vendor.documents) {
        const parsed = this.extractBucketAndKey(doc.url)
        if (!parsed) {
          console.warn('⚠️ Skipping invalid URL:', doc.url)
          continue
        }

        try {
          await this._storageService.deleteFile(parsed.bucket, parsed.key)
          console.log(`🗑️ Deleted: ${parsed.bucket}/${parsed.key}`)
        } catch (err) {
          console.error(` Failed to delete ${parsed.key}:`, err)
        }
      }

      // 🧹 Clear MongoDB docs reference
      vendor.documents = []
    }

    vendor.isVerified = {
      status: verificationStatus,
      reviewedBy: { adminId, reviewedAt },
      description: finalDescription,
    }

    await this._vendorRepository.update({ userId }, vendor)

    console.log(' Vendor verification status updated successfully')

    return {
      userId: vendor.userId ?? '',
      name: vendor.name ?? '',
      status: verificationStatus,
      reviewedBy: { adminId, reviewedAt },
      description: finalDescription,
    }
  }
}
