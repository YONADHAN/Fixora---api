import { inject, injectable } from 'tsyringe'
import { IVendorRepository } from '../../../domain/repositoryInterfaces/users/vendor_repository.interface'
import { IUploadVendorDocsUseCase } from '../../../domain/useCaseInterfaces/vendor/upload_vendor_docs_usecase.interface'
import { ICreateNotificationUseCase } from '../../../domain/useCaseInterfaces/notification/create_notification_usecase_interface'
import { IAdminRepository } from '../../../domain/repositoryInterfaces/users/admin_repository.interface'

@injectable()
export class UploadVendorDocsUseCase implements IUploadVendorDocsUseCase {
  constructor(
    @inject('IVendorRepository')
    private _vendorRepository: IVendorRepository,
    @inject('ICreateNotificationUseCase')
    private _createNotificationUseCase: ICreateNotificationUseCase,
    @inject('IAdminRepository')
    private _adminRepository: IAdminRepository
  ) { }

  async execute(
    userId: string,
    files: Express.Multer.File[],
    urls: string[]
  ): Promise<void> {
    const vendor = await this._vendorRepository.findOne({ userId })
    if (!vendor) {
      throw new Error('Vendor not found')
    }

    // Construct document objects
    const newDocuments = urls.map((url, index) => ({
      name: files[index]?.originalname || `document-${index + 1}`,
      url,
      verified: false,
      uploadedAt: new Date(),
    }))

    vendor.documents = [...(vendor.documents || []), ...newDocuments]
    if (!vendor.isVerified) {
      vendor.isVerified = {
        status: 'pending',
        description: '',
        reviewedBy: { adminId: null, reviewedAt: new Date() },
      }
    } else {
      vendor.isVerified.status = 'pending'
    }

    await this._vendorRepository.update({ userId }, vendor)

    const admins = await this._adminRepository.findAllDocsWithoutPagination({})
    if (admins.length > 0) {
      const admin = admins[0]
      await this._createNotificationUseCase.execute({
        recipientId: admin.userId as string,
        recipientRole: 'admin',
        type: 'VENDOR_DOCUMENTS_SUBMITTED',
        title: 'New Vendor Verification Request',
        message: `Vendor ${vendor.userId} has submitted documents for verification`,
        metadata: { vendorRef: vendor._id?.toString() },
      })
    }
  }
}
