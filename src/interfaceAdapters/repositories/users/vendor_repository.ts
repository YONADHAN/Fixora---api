import { injectable } from 'tsyringe'
import { BaseRepository } from '../base_repository'
import {
  VendorModel,
  IVendorModel,
} from '../../database/mongoDb/models/vendor_model'
import { IVendorRepository } from '../../../domain/repositoryInterfaces/users/vendor_repository.interface'
import { IVendorEntity } from '../../../domain/models/vendor_entity'

@injectable()
export class VendorRepository
  extends BaseRepository<IVendorModel, IVendorEntity>
  implements IVendorRepository
{
  constructor() {
    super(VendorModel)
  }

  protected toEntity(model: IVendorModel): IVendorEntity {
    return {
      userId: model.userId,
      _id: model._id,
      name: model.name,
      email: model.email,
      phone: model.phone,
      password: model.password,
      role: model.role,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,

      googleId: model.googleId,
      profileImage: model.profileImage,

      geoLocation: model.geoLocation
        ? {
            type: model.geoLocation.type,
            coordinates: model.geoLocation.coordinates,
          }
        : undefined,

      location: model.location
        ? {
            name: model.location.name,
            displayName: model.location.displayName,
            zipCode: model.location.zipCode,
          }
        : undefined,

      documents: model.documents
        ? model.documents.map((doc) => ({
            name: doc.name,
            url: doc.url,
            verified: doc.verified,
            uploadedAt: doc.uploadedAt,
          }))
        : undefined,

      isVerified: model.isVerified
        ? {
            status: model.isVerified.status,
            description: model.isVerified.description,
            reviewedBy: model.isVerified.reviewedBy
              ? {
                  adminId: model.isVerified.reviewedBy.adminId,
                  reviewedAt: model.isVerified.reviewedBy.reviewedAt,
                }
              : undefined,
          }
        : undefined,
    }
  }
}
