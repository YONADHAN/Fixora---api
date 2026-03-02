
import { bookingStatus } from '../../shared/constants'
export interface ISlotEntity {
  _id?: string
  slotId: string
  serviceRef: string
  slotDate: Date
  startTime: string
  endTime: string
  bookingStatus: bookingStatus
  bookedBy?: string
  bookingId?: string
}
