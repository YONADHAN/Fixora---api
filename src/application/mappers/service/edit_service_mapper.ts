import { recurrenceType } from '../../../shared/constants'

export class EditServiceRequestMapper {
  static toDTO({ rawData, files }: any) {
    const dto: any = {}

    if (rawData.title !== undefined) dto.title = rawData.title
    if (rawData.description !== undefined) dto.description = rawData.description

    if (rawData.pricing) {
      dto.pricing = {
        pricePerSlot: rawData.pricing.pricePerSlot
          ? Number(rawData.pricing.pricePerSlot)
          : undefined,

        isAdvanceRequired:
          rawData.pricing.isAdvanceRequired !== undefined
            ? rawData.pricing.isAdvanceRequired === 'true'
            : undefined,

        advanceAmountPerSlot: rawData.pricing.advanceAmountPerSlot
          ? Number(rawData.pricing.advanceAmountPerSlot)
          : undefined,

        currency: rawData.pricing.currency,
      }
    }

    if (rawData.isActiveStatusByVendor !== undefined)
      dto.isActiveStatusByVendor = rawData.isActiveStatusByVendor === 'true'

    if (rawData.adminStatusNote !== undefined)
      dto.adminStatusNote = rawData.adminStatusNote

    if (rawData.schedule) {
      dto.schedule = {
        visibilityStartDate: rawData.schedule.visibilityStartDate
          ? new Date(rawData.schedule.visibilityStartDate)
          : undefined,

        visibilityEndDate: rawData.schedule.visibilityEndDate
          ? new Date(rawData.schedule.visibilityEndDate)
          : undefined,

        workStartTime: rawData.schedule.workStartTime,
        workEndTime: rawData.schedule.workEndTime,

        slotDurationMinutes: rawData.schedule.slotDurationMinutes
          ? Number(rawData.schedule.slotDurationMinutes)
          : undefined,

        recurrenceType: rawData.schedule.recurrenceType
          ? (rawData.schedule.recurrenceType as recurrenceType)
          : undefined,

        weeklyWorkingDays: rawData.schedule.weeklyWorkingDays
          ? rawData.schedule.weeklyWorkingDays.split(',').map(Number)
          : undefined,

        monthlyWorkingDates: rawData.schedule.monthlyWorkingDates
          ? rawData.schedule.monthlyWorkingDates.split(',').map(Number)
          : undefined,

        holidayDates: rawData.schedule.holidayDates
          ? rawData.schedule.holidayDates
              .split(',')
              .map((d: string) => new Date(d))
          : undefined,
      }
    }

    if (files && files.length > 0) {
      dto.images = files
    }

    return dto
  }
}
