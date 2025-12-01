import { injectable } from 'tsyringe'
import { BaseRepository } from '../base_repository'
import {
  CustomerModel,
  ICustomerModel,
} from '../../database/mongoDb/models/customer_model'
import { ICustomerRepository } from '../../../domain/repositoryInterfaces/users/customer_repository.interface'
import { ICustomerEntity } from '../../../domain/models/customer_entity'

@injectable()
export class CustomerRepository
  extends BaseRepository<ICustomerModel, ICustomerEntity>
  implements ICustomerRepository
{
  constructor() {
    super(CustomerModel)
  }

  protected toEntity(model: ICustomerModel): ICustomerEntity {
    return {
      userId: model.userId,
      _id: model._id,

      name: model.name,
      email: model.email,
      phone: model.phone,
      password: model.password,
      role: model.role,
      status: model.status,

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

      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }

  protected toModel(entity: Partial<ICustomerEntity>): Partial<ICustomerModel> {
    return {
      userId: entity.userId,
      name: entity.name,
      email: entity.email,
      phone: entity.phone,
      password: entity.password,
      role: entity.role,
      status: entity.status,

      googleId: entity.googleId,
      profileImage: entity.profileImage,

      geoLocation: entity.geoLocation
        ? {
            type: entity.geoLocation.type,
            coordinates: entity.geoLocation.coordinates,
          }
        : undefined,

      location: entity.location
        ? {
            name: entity.location.name,
            displayName: entity.location.displayName,
            zipCode: entity.location.zipCode,
          }
        : undefined,
    }
  }
}
