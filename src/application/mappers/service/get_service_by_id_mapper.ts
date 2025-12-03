import { IServiceEntity } from '../../../domain/models/service_entity'

export class GetServiceByIdRequestMapper {
  static toDTO(validated: { params: { serviceId: string } }) {
    return {
      serviceId: validated.params.serviceId,
    }
  }
}

export class GetServiceByIdResponseMapper {
  static toDTO(entity: IServiceEntity) {
    return {
      vendorId: entity.vendorRef,
      subServiceCategoryId: entity.subServiceCategoryRef,

      title: entity.title,
      description: entity.description,

      pricing: {
        pricePerSlot: entity.pricing.pricePerSlot,
        isAdvanceRequired: entity.pricing.isAdvanceRequired,
        advanceAmountPerSlot: entity.pricing.advanceAmountPerSlot,
        currency: entity.pricing.currency,
      },

      isActiveStatusByVendor: entity.isActiveStatusByVendor,
      isActiveStatusByAdmin: entity.isActiveStatusByAdmin,
      adminStatusNote: entity.adminStatusNote,

      schedule: {
        visibilityStartDate: entity.schedule.visibilityStartDate,
        visibilityEndDate: entity.schedule.visibilityEndDate,

        workStartTime: entity.schedule.workStartTime,
        workEndTime: entity.schedule.workEndTime,
        slotDurationMinutes: entity.schedule.slotDurationMinutes,

        recurrenceType: entity.schedule.recurrenceType,
        weeklyWorkingDays: entity.schedule.weeklyWorkingDays,
        monthlyWorkingDates: entity.schedule.monthlyWorkingDates,
        holidayDates: entity.schedule.holidayDates,
      },

      images: entity.images,
    }
  }
}

import { ResponseEditServiceDTO } from '../../dtos/service_dto'

export class EditServiceResponseMapper {
  static toDTO(entity: any): ResponseEditServiceDTO {
    return {
      serviceId: entity.serviceId,

      title: entity.title,
      description: entity.description,

      pricing: {
        pricePerSlot: entity.pricing.pricePerSlot,
        isAdvanceRequired: entity.pricing.isAdvanceRequired,
        advanceAmountPerSlot: entity.pricing.advanceAmountPerSlot,
        currency: entity.pricing.currency,
      },

      schedule: {
        ...entity.schedule,
      },

      images: entity.images,

      isActiveStatusByVendor: entity.isActiveStatusByVendor,
      isActiveStatusByAdmin: entity.isActiveStatusByAdmin,
      adminStatusNote: entity.adminStatusNote,

      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }
}
