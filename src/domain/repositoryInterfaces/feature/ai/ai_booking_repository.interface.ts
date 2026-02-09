import { AIRole } from '../../../../shared/types/ai/ai.types'
import { IBookingEntity } from '../../../models/booking_entity'

export interface IAiBookingRepository {
  getBookingsForAI(params: {
    role: AIRole
    userId: string
    status?: IBookingEntity['serviceStatus']
    paymentStatus?: IBookingEntity['paymentStatus']
    search?: string
    limit?: number
  }): Promise<
    Array<{
      bookingId: string
      serviceName: string
      date: string
      status: IBookingEntity['serviceStatus']
      paymentStatus: IBookingEntity['paymentStatus']
    }>
  >
}
