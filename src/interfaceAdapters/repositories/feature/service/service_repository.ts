import { injectable } from 'tsyringe'
import {
  ServiceModel,
  IServiceModel,
} from '../../../database/mongoDb/models/service_model'
import { BaseRepository } from '../../base_repository'
import { IServiceRepository } from '../../../../domain/repositoryInterfaces/feature/service/service_repository.interface'
import { IServiceEntity } from '../../../../domain/models/service_entity'
import { Types } from 'mongoose'
import {
  ISubServiceCategoryPopulated,
  IVendorPopulated,
} from '../../../../shared/types/populated_values'

// -------------------------------------
// TYPE GUARDS
// -------------------------------------
function isVendorPopulated(ref: any): ref is IVendorPopulated {
  return (
    ref &&
    typeof ref === 'object' &&
    '_id' in ref &&
    'name' in ref &&
    'userId' in ref
  )
}

function isSubCategoryPopulated(ref: any): ref is ISubServiceCategoryPopulated {
  return (
    ref &&
    typeof ref === 'object' &&
    '_id' in ref &&
    'name' in ref &&
    'subServiceCategoryId' in ref
  )
}

@injectable()
export class ServiceRepository
  extends BaseRepository<IServiceModel, IServiceEntity>
  implements IServiceRepository
{
  constructor() {
    super(ServiceModel)
  }

  // ------------------------------------
  //          ENTITY → MODEL
  // ------------------------------------
  protected toModel(entity: Partial<IServiceEntity>): Partial<IServiceModel> {
    return {
      vendorRef: entity.vendorRef
        ? new Types.ObjectId(entity.vendorRef)
        : undefined,

      subServiceCategoryRef: entity.subServiceCategoryRef
        ? new Types.ObjectId(entity.subServiceCategoryRef)
        : undefined,

      serviceId: entity.serviceId,
      name: entity.name,
      description: entity.description,

      serviceVariants: entity.serviceVariants
        ? entity.serviceVariants.map((v) => ({
            name: v.name,
            description: v.description,
            price: v.price,
          }))
        : [],

      pricing: entity.pricing
        ? {
            pricePerSlot: entity.pricing.pricePerSlot,
            advanceAmountPerSlot: entity.pricing.advanceAmountPerSlot,
          }
        : undefined,

      mainImage: entity.mainImage,

      isActiveStatusByAdmin: entity.isActiveStatusByAdmin,
      isActiveStatusByVendor: entity.isActiveStatusByVendor,
      adminStatusNote: entity.adminStatusNote,

      schedule: entity.schedule
        ? {
            visibilityStartDate: entity.schedule.visibilityStartDate,
            visibilityEndDate: entity.schedule.visibilityEndDate,

            dailyWorkingWindows: entity.schedule.dailyWorkingWindows?.map(
              (w) => ({
                startTime: w.startTime,
                endTime: w.endTime,
              })
            ),

            slotDurationMinutes: entity.schedule.slotDurationMinutes,

            recurrenceType: entity.schedule.recurrenceType,
            weeklyWorkingDays: entity.schedule.weeklyWorkingDays,
            monthlyWorkingDates: entity.schedule.monthlyWorkingDates,

            overrideBlock: entity.schedule.overrideBlock?.map((b) => ({
              startDateTime: b.startDateTime,
              endDateTime: b.endDateTime,
              reason: b.reason,
            })),

            overrideCustom: entity.schedule.overrideCustom?.map((c) => ({
              startDateTime: c.startDateTime,
              endDateTime: c.endDateTime,
              startTime: c.startTime,
              endTime: c.endTime,
            })),
          }
        : undefined,
    }
  }

  // ------------------------------------
  //          MODEL → ENTITY
  // ------------------------------------
  protected toEntity(model: IServiceModel): IServiceEntity {
    const entity: IServiceEntity = {
      _id: model._id.toString(),
      serviceId: model.serviceId,
      vendorRef: model.vendorRef.toString(),
      subServiceCategoryRef: model.subServiceCategoryRef.toString(),

      name: model.name,
      description: model.description,

      serviceVariants: model.serviceVariants?.map((v) => ({
        name: v.name,
        description: v.description,
        price: v.price,
      })),

      pricing: {
        pricePerSlot: model.pricing.pricePerSlot,
        advanceAmountPerSlot: model.pricing.advanceAmountPerSlot,
      },

      mainImage: model.mainImage,

      isActiveStatusByAdmin: model.isActiveStatusByAdmin,
      isActiveStatusByVendor: model.isActiveStatusByVendor,
      adminStatusNote: model.adminStatusNote,

      schedule: {
        visibilityStartDate: model.schedule.visibilityStartDate,
        visibilityEndDate: model.schedule.visibilityEndDate,

        dailyWorkingWindows: model.schedule.dailyWorkingWindows?.map((w) => ({
          startTime: w.startTime,
          endTime: w.endTime,
        })),

        slotDurationMinutes: model.schedule.slotDurationMinutes,

        recurrenceType: model.schedule.recurrenceType,
        weeklyWorkingDays: model.schedule.weeklyWorkingDays,
        monthlyWorkingDates: model.schedule.monthlyWorkingDates,

        overrideBlock: model.schedule.overrideBlock?.map((b) => ({
          startDateTime: b.startDateTime,
          endDateTime: b.endDateTime,
          reason: b.reason,
        })),

        overrideCustom: model.schedule.overrideCustom?.map((c) => ({
          startDateTime: c.startDateTime,
          endDateTime: c.endDateTime,
          startTime: c.startTime,
          endTime: c.endTime,
        })),
      },

      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }

    // ----------------------------------------
    //        POPULATED VALUES HANDLING
    // ----------------------------------------
    entity.populatedValues = {}

    if (isVendorPopulated(model.vendorRef)) {
      entity.populatedValues.vendor = {
        name: model.vendorRef.name,
        userId: model.vendorRef.userId.toString(),
        profileImage: model.vendorRef.profileImage,
        geoLocation: model.vendorRef.geoLocation,
        location: model.vendorRef.location,
        status: model.vendorRef.status,
      }
    }

    if (isSubCategoryPopulated(model.subServiceCategoryRef)) {
      entity.populatedValues.subServiceCategory = {
        subServiceCategoryId: model.subServiceCategoryRef.subServiceCategoryId,
        name: model.subServiceCategoryRef.name,
        isActive: model.subServiceCategoryRef.isActive,
      }
    }

    return entity
  }
}
