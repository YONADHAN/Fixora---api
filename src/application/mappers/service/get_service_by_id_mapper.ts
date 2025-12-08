import { IServiceEntity } from '../../../domain/models/service_entity'
import { ResponseGetServiceByIdDTO } from '../../dtos/service_dto'

export class GetServiceByIdRequestMapper {
  static toDTO(validated: { params: { serviceId: string } }) {
    return {
      serviceId: validated.params.serviceId,
    }
  }
}

export class GetServiceByIdResponseMapper {
  static toDTO(entity: IServiceEntity): ResponseGetServiceByIdDTO {
    return {
      serviceId: entity.serviceId,

      vendorId: entity.vendorRef,
      subServiceCategoryId: entity.subServiceCategoryRef,

      name: entity.name,
      description: entity.description,

      serviceVariants: entity.serviceVariants ?? [],

      pricing: {
        pricePerSlot: entity.pricing.pricePerSlot,
        advanceAmountPerSlot: entity.pricing.advanceAmountPerSlot,
      },

      mainImage: entity.mainImage,

      isActiveStatusByVendor: entity.isActiveStatusByVendor,
      isActiveStatusByAdmin: entity.isActiveStatusByAdmin,
      adminStatusNote: entity.adminStatusNote,

      schedule: {
        visibilityStartDate: entity.schedule.visibilityStartDate,
        visibilityEndDate: entity.schedule.visibilityEndDate,

        dailyWorkingWindows: entity.schedule.dailyWorkingWindows ?? [],

        slotDurationMinutes: entity.schedule.slotDurationMinutes,
        recurrenceType: entity.schedule.recurrenceType,

        weeklyWorkingDays: entity.schedule.weeklyWorkingDays ?? [],
        monthlyWorkingDates: entity.schedule.monthlyWorkingDates ?? [],

        overrideBlock: entity.schedule.overrideBlock ?? [],
        overrideCustom: entity.schedule.overrideCustom ?? [],
      },

      populatedValues: {
        vendor: entity.populatedValues?.vendor
          ? {
              name: entity.populatedValues.vendor.name,
              userId: entity.populatedValues.vendor.userId,
              profileImage: entity.populatedValues.vendor.profileImage,
            }
          : undefined,

        subServiceCategory: entity.populatedValues?.subServiceCategory
          ? {
              subServiceCategoryId:
                entity.populatedValues.subServiceCategory.subServiceCategoryId,
              name: entity.populatedValues.subServiceCategory.name,
              isActive: entity.populatedValues.subServiceCategory.isActive,
            }
          : undefined,
      },

      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }
}
