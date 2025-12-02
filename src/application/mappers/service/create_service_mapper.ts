// src/application/mappers/service/create_service_mapper.ts
import { recurrenceType } from '../../../shared/constants'

export class CreateServiceRequestMapper {
  static toDTO({ rawData, files }: any) {
    return {
      vendorId: rawData.vendorId,
      subServiceCategoryId: rawData.subServiceCategoryId,

      title: rawData.title,
      description: rawData.description,

      pricing: {
        pricePerSlot: Number(rawData.pricing.pricePerSlot),
        isAdvanceRequired: rawData.pricing.isAdvanceRequired === 'true',
        advanceAmountPerSlot: Number(rawData.pricing.advanceAmountPerSlot),
        currency: rawData.pricing.currency ?? 'INR',
      },

      isActiveStatusByVendor: rawData.isActiveStatusByVendor === 'true',
      isActiveStatusByAdmin:
        rawData.isActiveStatusByAdmin === 'true' ? true : false,
      adminStatusNote: rawData.adminStatusNote ?? '',

      schedule: {
        visibilityStartDate: new Date(rawData.schedule.visibilityStartDate),
        visibilityEndDate: new Date(rawData.schedule.visibilityEndDate),

        workStartTime: rawData.schedule.workStartTime,
        workEndTime: rawData.schedule.workEndTime,

        slotDurationMinutes: Number(rawData.schedule.slotDurationMinutes),

        recurrenceType: rawData.schedule.recurrenceType as recurrenceType,

        weeklyWorkingDays: rawData.schedule.weeklyWorkingDays
          ? rawData.schedule.weeklyWorkingDays.split(',').map(Number)
          : [],

        monthlyWorkingDates: rawData.schedule.monthlyWorkingDates
          ? rawData.schedule.monthlyWorkingDates.split(',').map(Number)
          : [],

        holidayDates: rawData.schedule.holidayDates
          ? rawData.schedule.holidayDates
              .split(',')
              .map((date: string) => new Date(date))
          : [],
      },

      images: files,
    }
  }
}
