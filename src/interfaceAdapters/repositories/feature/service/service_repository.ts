import { injectable } from 'tsyringe'
import {
  ServiceModel,
  IServiceModel,
} from '../../../database/mongoDb/models/service_model'
import { BaseRepository } from '../../base_repository'
import { IServiceRepository } from '../../../../domain/repositoryInterfaces/feature/service/service_repository.interface'
import { IServiceEntity } from '../../../../domain/models/service_entity'
import { Schema, Types } from 'mongoose'

@injectable()
export class ServiceRepository
  extends BaseRepository<IServiceModel, IServiceEntity>
  implements IServiceRepository
{
  constructor() {
    super(ServiceModel)
  }

  // ------------------------------
  //         ENTITY → MODEL
  // ------------------------------
  protected toModel(entity: Partial<IServiceEntity>): Partial<IServiceModel> {
    return {
      vendorRef: entity.vendorRef
        ? new Schema.Types.ObjectId(entity.vendorRef)
        : undefined,

      subServiceCategoryRef: entity.subServiceCategoryRef
        ? new Schema.Types.ObjectId(entity.subServiceCategoryRef)
        : undefined,

      title: entity.title,
      description: entity.description,

      pricing: entity.pricing
        ? {
            pricePerSlot: entity.pricing.pricePerSlot,
            isAdvanceRequired: entity.pricing.isAdvanceRequired,
            advanceAmountPerSlot: entity.pricing.advanceAmountPerSlot,
            currency: entity.pricing.currency,
          }
        : undefined,

      images: entity.images,

      isActiveStatusByAdmin: entity.isActiveStatusByAdmin,
      isActiveStatusByVendor: entity.isActiveStatusByVendor,
      adminStatusNote: entity.adminStatusNote,

      schedule: entity.schedule
        ? {
            visibilityStartDate: entity.schedule.visibilityStartDate,
            visibilityEndDate: entity.schedule.visibilityEndDate,

            workStartTime: entity.schedule.workStartTime,
            workEndTime: entity.schedule.workEndTime,
            slotDurationMinutes: entity.schedule.slotDurationMinutes,

            recurrenceType: entity.schedule.recurrenceType,
            weeklyWorkingDays: entity.schedule.weeklyWorkingDays,
            monthlyWorkingDates: entity.schedule.monthlyWorkingDates,
            holidayDates: entity.schedule.holidayDates,
          }
        : undefined,

      serviceHistoryRefs: entity.serviceHistoryRefs
        ? entity.serviceHistoryRefs.map((id) =>
            typeof id === 'string' ? new Schema.Types.ObjectId(id) : id
          )
        : undefined,
    }
  }

  // ------------------------------
  //         MODEL → ENTITY
  // ------------------------------
  protected toEntity(model: IServiceModel): IServiceEntity {
    return {
      _id: model._id.toString(),

      vendorRef: model.vendorRef.toString(),
      subServiceCategoryRef: model.subServiceCategoryRef.toString(),

      title: model.title,
      description: model.description,

      pricing: {
        pricePerSlot: model.pricing.pricePerSlot,
        isAdvanceRequired: model.pricing.isAdvanceRequired,
        advanceAmountPerSlot: model.pricing.advanceAmountPerSlot,
        currency: model.pricing.currency,
      },

      images: model.images,

      isActiveStatusByAdmin: model.isActiveStatusByAdmin,
      isActiveStatusByVendor: model.isActiveStatusByVendor,
      adminStatusNote: model.adminStatusNote,

      schedule: {
        visibilityStartDate: model.schedule.visibilityStartDate,
        visibilityEndDate: model.schedule.visibilityEndDate,

        workStartTime: model.schedule.workStartTime,
        workEndTime: model.schedule.workEndTime,
        slotDurationMinutes: model.schedule.slotDurationMinutes,

        recurrenceType: model.schedule.recurrenceType,
        weeklyWorkingDays: model.schedule.weeklyWorkingDays,
        monthlyWorkingDates: model.schedule.monthlyWorkingDates,
        holidayDates: model.schedule.holidayDates,
      },

      serviceHistoryRefs: model.serviceHistoryRefs
        ? model.serviceHistoryRefs.map((ref) => ref.toString())
        : [],

      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }
}
