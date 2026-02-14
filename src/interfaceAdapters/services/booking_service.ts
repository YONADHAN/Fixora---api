import { IServiceEntity } from '../../domain/models/service_entity'
import { CustomError } from '../../domain/utils/custom.error'
import { injectable } from 'tsyringe'
import { IBookingServices } from '../../domain/serviceInterfaces/booking_service_interface'
import { IBookingEntity } from '../../domain/models/booking_entity'
import { GetAvailableSlotsForCustomerResponseDTO } from '../../application/dtos/booking_dto'

type TimeWindow = {
  start: Date
  end: Date
}

type Timeline = {
  [date: string]: TimeWindow[]
}

@injectable()
export class BookingServices implements IBookingServices {
  constructor() {}

  // create date in local time
  private createLocalDate(
    year: number,
    month: number,
    day: number,
    hours = 0,
    minutes = 0
  ): Date {
    return new Date(year, month, day, hours, minutes, 0, 0)
  }

  private toLocalMidnight(date: Date): Date {
    return this.createLocalDate(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    )
  }

  validationChecker = (service: IServiceEntity | null) => {
    if (!service) {
      throw new CustomError('Service not found', 404)
    }

    if (!service.isActiveStatusByAdmin || !service.isActiveStatusByVendor) {
      throw new CustomError('Service is not active', 403)
    }

    if (!service.schedule.slotDurationMinutes) {
      throw new CustomError('Slot duration not configured', 400)
    }

    if (
      !service.schedule.dailyWorkingWindows ||
      service.schedule.dailyWorkingWindows.length === 0
    ) {
      throw new CustomError('Daily working windows not configured', 400)
    }
  }

  toLocalDateKey(date: Date): string {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  showAvailableSlotsForCustomers = async (
    service: IServiceEntity,
    month: number,
    year: number,
    bookedSlots: IBookingEntity[]
  ) => {
    this.validationChecker(service)

    let timeline: Timeline = {}

    timeline = this.buildDateRange(timeline, service, month, year)
    timeline = this.applyRecurrence(timeline, service)
    timeline = this.buildBaseWindows(timeline, service)
    timeline = this.applyCustomOverrides(timeline, service)
    timeline = this.applyBlockOverrides(timeline, service)
    timeline = this.removeBookedSlots(timeline, bookedSlots)
    timeline = await this.removeHeldSlots(timeline, service)

    return this.sliceIntoSlots(timeline, service.schedule.slotDurationMinutes)
  }

  buildDateRange = (
    timeline: Timeline,
    service: IServiceEntity,
    month: number,
    year: number
  ): Timeline => {
    const monthStart = this.createLocalDate(year, month, 1)
    const monthEnd = this.createLocalDate(year, month + 1, 0)

    let start = monthStart
    if (service.schedule.visibilityStartDate) {
      const visStart = this.toLocalMidnight(
        service.schedule.visibilityStartDate
      )
      if (visStart.getTime() > monthStart.getTime()) {
        start = visStart
      }
    }

    let end = monthEnd
    if (service.schedule.visibilityEndDate) {
      const visEnd = this.toLocalMidnight(service.schedule.visibilityEndDate)
      if (visEnd.getTime() < monthEnd.getTime()) {
        end = visEnd
      }
    }

    const current = this.createLocalDate(
      start.getFullYear(),
      start.getMonth(),
      start.getDate()
    )

    while (current <= end) {
      const key = this.toLocalDateKey(current)
      timeline[key] = []
      current.setDate(current.getDate() + 1)
    }

    return timeline
  }

  applyRecurrence = (timeline: Timeline, service: IServiceEntity): Timeline => {
    const { recurrenceType, weeklyWorkingDays, monthlyWorkingDates } =
      service.schedule

    for (const dateKey of Object.keys(timeline)) {
      const [y, m, d] = dateKey.split('-').map(Number)
      const date = this.createLocalDate(y, m - 1, d)

      if (
        recurrenceType === 'weekly' &&
        Array.isArray(weeklyWorkingDays) &&
        !weeklyWorkingDays.includes(date.getDay())
      ) {
        delete timeline[dateKey]
        continue
      }

      if (
        recurrenceType === 'monthly' &&
        Array.isArray(monthlyWorkingDates) &&
        !monthlyWorkingDates.includes(date.getDate())
      ) {
        delete timeline[dateKey]
      }
    }

    return timeline
  }

  buildBaseWindows = (
    timeline: Timeline,
    service: IServiceEntity
  ): Timeline => {
    for (const dateKey of Object.keys(timeline)) {
      const [y, m, d] = dateKey.split('-').map(Number)
      const date = this.createLocalDate(y, m - 1, d)

      timeline[dateKey] = service.schedule.dailyWorkingWindows.map((w) => {
        const [sh, sm] = w.startTime.split(':').map(Number)
        const [eh, em] = w.endTime.split(':').map(Number)

        const start = this.createLocalDate(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          sh,
          sm
        )
        const end = this.createLocalDate(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          eh,
          em
        )

        return { start, end }
      })
    }

    return timeline
  }

  applyCustomOverrides = (
    timeline: Timeline,
    service: IServiceEntity
  ): Timeline => {
    const overrides = service.schedule.overrideCustom || []

    const overriddenDates = new Set<string>()

    for (const o of overrides) {
      const overrideStart = this.toLocalMidnight(o.startDateTime)
      const overrideEnd = this.toLocalMidnight(o.endDateTime)

      const current = this.createLocalDate(
        overrideStart.getFullYear(),
        overrideStart.getMonth(),
        overrideStart.getDate()
      )

      while (current <= overrideEnd) {
        const key = this.toLocalDateKey(current)
        if (!timeline[key]) {
          current.setDate(current.getDate() + 1)
          continue
        }

        if (!overriddenDates.has(key)) {
          timeline[key] = []
          overriddenDates.add(key)
        }

        let start: Date
        let end: Date

        if (o.startTime && o.endTime) {
          const [sh, sm] = o.startTime.split(':').map(Number)
          const [eh, em] = o.endTime.split(':').map(Number)
          start = this.createLocalDate(
            current.getFullYear(),
            current.getMonth(),
            current.getDate(),
            sh,
            sm
          )
          end = this.createLocalDate(
            current.getFullYear(),
            current.getMonth(),
            current.getDate(),
            eh,
            em
          )
        } else {
          const startDT = new Date(o.startDateTime)
          const endDT = new Date(o.endDateTime)
          start = this.createLocalDate(
            current.getFullYear(),
            current.getMonth(),
            current.getDate(),
            startDT.getHours(),
            startDT.getMinutes()
          )
          end = this.createLocalDate(
            current.getFullYear(),
            current.getMonth(),
            current.getDate(),
            endDT.getHours(),
            endDT.getMinutes()
          )
        }

        timeline[key].push({ start, end })
        current.setDate(current.getDate() + 1)
      }
    }

    return timeline
  }

  applyBlockOverrides = (
    timeline: Timeline,
    service: IServiceEntity
  ): Timeline => {
    const blocks = service.schedule.overrideBlock || []

    for (const block of blocks) {
      const blockStart = new Date(block.startDateTime)
      const blockEnd = new Date(block.endDateTime)

      const key = this.toLocalDateKey(blockStart)
      if (!timeline[key]) continue

      const localBlockStart = this.createLocalDate(
        blockStart.getFullYear(),
        blockStart.getMonth(),
        blockStart.getDate(),
        blockStart.getHours(),
        blockStart.getMinutes()
      )
      const localBlockEnd = this.createLocalDate(
        blockEnd.getFullYear(),
        blockEnd.getMonth(),
        blockEnd.getDate(),
        blockEnd.getHours(),
        blockEnd.getMinutes()
      )

      timeline[key] = this.subtractRange(
        timeline[key],
        localBlockStart,
        localBlockEnd
      )
    }

    return timeline
  }

  removeBookedSlots = (
    timeline: Timeline,
    bookedSlots: IBookingEntity[]
  ): Timeline => {
    for (const booking of bookedSlots) {
      if (!booking.slotStart || !booking.slotEnd) continue

      const slotStart = new Date(booking.slotStart)
      const slotEnd = new Date(booking.slotEnd)

      const dateKey = this.toLocalDateKey(slotStart)
      if (!timeline[dateKey]) continue

      const localSlotStart = this.createLocalDate(
        slotStart.getFullYear(),
        slotStart.getMonth(),
        slotStart.getDate(),
        slotStart.getHours(),
        slotStart.getMinutes()
      )
      const localSlotEnd = this.createLocalDate(
        slotEnd.getFullYear(),
        slotEnd.getMonth(),
        slotEnd.getDate(),
        slotEnd.getHours(),
        slotEnd.getMinutes()
      )

      timeline[dateKey] = this.subtractRange(
        timeline[dateKey],
        localSlotStart,
        localSlotEnd
      )
    }

    return timeline
  }

  removeHeldSlots = async (
    timeline: Timeline,
    service: IServiceEntity
  ): Promise<Timeline> => {
    // Redis
    return timeline
  }

  subtractRange = (
    windows: TimeWindow[],
    removeStart: Date,
    removeEnd: Date
  ): TimeWindow[] => {
    const result: TimeWindow[] = []

    for (const w of windows) {
      if (removeEnd <= w.start || removeStart >= w.end) {
        result.push(w)
        continue
      }

      if (removeStart > w.start) {
        result.push({ start: w.start, end: new Date(removeStart) })
      }

      if (removeEnd < w.end) {
        result.push({ start: new Date(removeEnd), end: w.end })
      }
    }

    return result
  }

  sliceIntoSlots = (
    timeline: Timeline,
    slotDurationMinutes: number
  ): GetAvailableSlotsForCustomerResponseDTO => {
    const result: Record<string, { start: string; end: string }[]> = {}

    for (const date in timeline) {
      const slots = []

      for (const window of timeline[date]) {
        let cursor = new Date(window.start)

        while (
          cursor.getTime() + slotDurationMinutes * 60000 <=
          window.end.getTime()
        ) {
          const slotStart = new Date(cursor)
          const slotEnd = new Date(
            cursor.getTime() + slotDurationMinutes * 60000
          )

          const pad = (n: number) => n.toString().padStart(2, '0')

          slots.push({
            start: `${pad(slotStart.getHours())}:${pad(
              slotStart.getMinutes()
            )}`,
            end: `${pad(slotEnd.getHours())}:${pad(slotEnd.getMinutes())}`,
          })

          cursor = slotEnd
        }
      }

      if (slots.length > 0) {
        result[date] = slots
      }
    }

    return result
  }
}
