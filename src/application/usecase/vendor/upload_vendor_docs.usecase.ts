import { inject, injectable } from 'tsyringe'
import { IVendorRepository } from '../../../domain/repositoryInterfaces/users/vendor_repository.interface'
import { IUploadVendorDocsUseCase } from '../../../domain/useCaseInterfaces/vendor/upload_vendor_docs_usecase.interface'
import { Express } from 'express'

@injectable()
export class UploadVendorDocsUseCase implements IUploadVendorDocsUseCase {
  constructor(
    @inject('IVendorRepository')
    private _vendorRepository: IVendorRepository
  ) {}

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
    console.log('Vendor Documents', vendor)
    await this._vendorRepository.update({ userId }, vendor)
  }
}
