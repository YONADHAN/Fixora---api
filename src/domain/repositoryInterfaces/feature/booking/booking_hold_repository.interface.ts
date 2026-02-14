import { IBookingHoldEntity } from '../../../models/booking_hold_entity'
import { IBaseRepository } from '../../base_repository.interface'

export interface IBookingHoldRepository
  extends IBaseRepository<IBookingHoldEntity> {
  findActiveHoldById(holdId: string): Promise<IBookingHoldEntity | null>

  findByStripePaymentIntentId(
    paymentIntentId: string
  ): Promise<IBookingHoldEntity | null>

  markHoldAsCompleted(holdId: string): Promise<void>

  markHoldAsFailed(holdId: string): Promise<void>

  findExpiredActiveHolds(now: Date): Promise<IBookingHoldEntity[]>

  markHoldAsExpired(holdId: string): Promise<void>
}
