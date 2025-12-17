import { IBookingHoldEntity } from '../../../models/booking_hold_entity'
import { IBaseRepository } from '../../base_repository.interface'

export interface IBookingHoldRepository
  extends IBaseRepository<IBookingHoldEntity> {
  /**
   * Used before payment to validate an active hold
   */
  findActiveHoldById(
    holdId: string
  ): Promise<IBookingHoldEntity | null>

  /**
   * Used by Stripe webhook to resolve payment → hold
   */
  findByStripePaymentIntentId(
    paymentIntentId: string
  ): Promise<IBookingHoldEntity | null>

  /**
   * Mark hold as completed after successful payment
   */
  markHoldAsCompleted(holdId: string): Promise<void>

  /**
   * Mark hold as failed if payment fails
   */
  markHoldAsFailed(holdId: string): Promise<void>
}
