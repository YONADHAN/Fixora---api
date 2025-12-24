import { injectable } from 'tsyringe'

import { BaseRepository } from '../../base_repository'
import {
  AddressModel,
  IAddressModel,
} from '../../../database/mongoDb/models/address_model'

import { IAddressRepository } from '../../../../domain/repositoryInterfaces/feature/address/address_repository.interface'
import { IAddressEntity } from '../../../../domain/models/address_entity'
import { AddressMongoBase } from '../../../database/mongoDb/types/address_mongo_base'
import { CustomError } from '../../../../domain/utils/custom.error'
import { FilterQuery } from 'mongoose'

@injectable()
export class AddressRepository
  extends BaseRepository<IAddressModel, IAddressEntity>
  implements IAddressRepository
{
  constructor() {
    super(AddressModel)
  }

  protected toEntity(model: AddressMongoBase): IAddressEntity {
    return {
      _id: model._id.toString(),

      addressId: model.addressId,
      customerId: model.customerId,

      label: model.label,
      addressType: model.addressType,

      isDefault: model.isDefault,
      isActive: model.isActive,

      contactName: model.contactName,
      contactPhone: model.contactPhone,

      addressLine1: model.addressLine1,
      addressLine2: model.addressLine2,
      landmark: model.landmark,

      city: model.city,
      state: model.state,
      country: model.country,
      zipCode: model.zipCode,

      instructions: model.instructions,

      geoLocation: model.geoLocation,
      location: model.location,

      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }

  protected toModel(entity: Partial<IAddressEntity>): Partial<IAddressModel> {
    if (entity.geoLocation) {
      this.validateGeoLocation(entity.geoLocation)
    }

    return {
      addressId: entity.addressId,
      customerId: entity.customerId,

      label: entity.label,
      addressType: entity.addressType,

      isDefault: entity.isDefault,
      isActive: entity.isActive,

      contactName: entity.contactName,
      contactPhone: entity.contactPhone,

      addressLine1: entity.addressLine1,
      addressLine2: entity.addressLine2,
      landmark: entity.landmark,

      city: entity.city,
      state: entity.state,
      country: entity.country,
      zipCode: entity.zipCode,

      instructions: entity.instructions,

      geoLocation: entity.geoLocation,
      location: entity.location,
    }
  }

  private validateGeoLocation(geoLocation: IAddressEntity['geoLocation']) {
    if (
      geoLocation.type !== 'Point' ||
      !Array.isArray(geoLocation.coordinates) ||
      geoLocation.coordinates.length !== 2
    ) {
      throw new CustomError('Invalid geoLocation format', 400)
    }
  }

  async findDefaultAddress(customerId: string): Promise<IAddressEntity | null> {
    const address = await this.model
      .findOne({ customerId, isDefault: true, isActive: true })
      .lean<AddressMongoBase | null>()

    return address ? this.toEntity(address) : null
  }

  async findAddressByCustomerId(
    page: number,
    limit: number,
    search: string = '',
    extraFilters: FilterQuery<IAddressModel> = {}
  ): Promise<{
    data: IAddressEntity[]
    currentPage: number
    totalPages: number
  }> {
    const skip = (page - 1) * limit

    const filter: FilterQuery<IAddressModel> = {
      ...extraFilters,
      ...(search
        ? {
            $or: [
              { label: { $regex: search, $options: 'i' } },
              { addressType: { $regex: search, $options: 'i' } },
              { city: { $regex: search, $options: 'i' } },
              { state: { $regex: search, $options: 'i' } },
              { zipCode: { $regex: search, $options: 'i' } },
            ],
          }
        : {}),
    }

    const [documents, totalCount] = await Promise.all([
      this.model
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean<AddressMongoBase[]>(),

      this.model.countDocuments(filter),
    ])

    return {
      data: documents.map((doc) => this.toEntity(doc)),
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    }
  }

  async clearDefaultAddress(customerId: string): Promise<void> {
    await this.model.updateMany({ customerId }, { $set: { isDefault: false } })
  }

  async setDefaultAddress(
    customerId: string,
    addressId: string
  ): Promise<void> {
    await this.model.updateMany({ customerId }, { $set: { isDefault: false } })

    const result = await this.model.updateOne(
      { addressId, customerId },
      { $set: { isDefault: true } }
    )

    if (result.matchedCount === 0) {
      throw new CustomError('Address not found', 404)
    }
  }
}
