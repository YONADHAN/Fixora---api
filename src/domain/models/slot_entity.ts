import mongoose from 'mongoose'
import { bookingStatus } from '../../shared/constants'
export interface ISlotEntity {
  slotId: string
  serviceId: mongoose.Types.ObjectId
  slotDate: Date
  startTime: string
  endTime: string
  bookingStatus: bookingStatus
  bookedBy: mongoose.ObjectId
  bookingId: mongoose.ObjectId
}
