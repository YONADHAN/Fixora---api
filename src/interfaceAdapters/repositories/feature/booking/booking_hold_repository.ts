import { injectable } from 'tsyringe'
import { Types } from 'mongoose'

import { BaseRepository } from '../../base_repository'
import {
  BookingHoldModel,
  IBookingHoldModel,
} from '../../../database/mongoDb/models/booking_hold_model'

import { IBookingHoldRepository } from '../../../../domain/repositoryInterfaces/feature/booking/booking_hold_repository.interface'
import { IBookingHoldEntity } from '../../../../domain/models/booking_hold_entity'
import { BookingHoldMongoBase } from '../../../database/mongoDb/types/booking_hold_base'
import { CustomError } from '../../../../domain/utils/custom.error'

@injectable()
export class BookingHoldRepository
  extends BaseRepository<IBookingHoldModel, IBookingHoldEntity>
  implements IBookingHoldRepository
{
  constructor() {
    super(BookingHoldModel)
  }

  /* ───────────── Utilities ───────────── */

  private validateObjectId(id: string | undefined, fieldName: string): void {
    if (id && !Types.ObjectId.isValid(id)) {
      throw new CustomError(`Invalid ${fieldName}`, 400)
    }
  }

  /* ───────────── Entity → Model ───────────── */

  protected toModel(
    entity: Partial<IBookingHoldEntity>
  ): Partial<IBookingHoldModel> {
    this.validateObjectId(entity.serviceRef, 'serviceRef')
    this.validateObjectId(entity.vendorRef, 'vendorRef')
    this.validateObjectId(entity.customerRef, 'customerRef')

    return {
      holdId: entity.holdId,

      serviceRef: entity.serviceRef
        ? new Types.ObjectId(entity.serviceRef)
        : undefined,

      vendorRef: entity.vendorRef
        ? new Types.ObjectId(entity.vendorRef)
        : undefined,

      customerRef: entity.customerRef
        ? new Types.ObjectId(entity.customerRef)
        : undefined,

      slots: entity.slots?.map((s) => ({
        date: s.date,
        start: s.start,
        end: s.end,

        pricePerSlot: s.pricePerSlot,
        advancePerSlot: s.advancePerSlot,

        variant: s.variant
          ? {
              name: s.variant.name,
              price: s.variant.price,
            }
          : undefined,
      })),

      pricing: entity.pricing
        ? {
            totalAmount: entity.pricing.totalAmount,
            advanceAmount: entity.pricing.advanceAmount,
            remainingAmount: entity.pricing.remainingAmount,
          }
        : undefined,

      paymentMethod: entity.paymentMethod,

      stripePaymentIntentId: entity.stripePaymentIntentId,

      status: entity.status,

      expiresAt: entity.expiresAt,
    }
  }

  /* ───────────── Model → Entity ───────────── */

  protected toEntity(model: BookingHoldMongoBase): IBookingHoldEntity {
    return {
      _id: model._id.toString(),

      holdId: model.holdId,

      serviceRef: model.serviceRef.toString(),
      vendorRef: model.vendorRef.toString(),
      customerRef: model.customerRef.toString(),

      slots: model.slots.map((s) => ({
        date: s.date,
        start: s.start,
        end: s.end,

        pricePerSlot: s.pricePerSlot,
        advancePerSlot: s.advancePerSlot,

        variant: s.variant
          ? {
              name: s.variant.name,
              price: s.variant.price,
            }
          : undefined,
      })),

      pricing: {
        totalAmount: model.pricing.totalAmount,
        advanceAmount: model.pricing.advanceAmount,
        remainingAmount: model.pricing.remainingAmount,
      },

      paymentMethod: model.paymentMethod,

      stripePaymentIntentId: model.stripePaymentIntentId,

      status: model.status,

      expiresAt: model.expiresAt,

      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }

  /* ───────────── Custom Queries ───────────── */

  async findActiveHoldById(holdId: string): Promise<IBookingHoldEntity | null> {
    const hold = await this.model
      .findOne({ holdId, status: 'active' })
      .lean<BookingHoldMongoBase | null>()

    return hold ? this.toEntity(hold) : null
  }

  async findByStripePaymentIntentId(
    paymentIntentId: string
  ): Promise<IBookingHoldEntity | null> {
    const hold = await this.model
      .findOne({ stripePaymentIntentId: paymentIntentId })
      .lean<BookingHoldMongoBase | null>()

    return hold ? this.toEntity(hold) : null
  }

  async markHoldAsCompleted(holdId: string): Promise<void> {
    await this.model.updateOne({ holdId }, { $set: { status: 'completed' } })
  }

  async markHoldAsFailed(holdId: string): Promise<void> {
    await this.model.updateOne({ holdId }, { $set: { status: 'failed' } })
  }

  async findExpiredActiveHolds(now: Date): Promise<IBookingHoldEntity[]> {
    const holds = await this.model
      .find({
        status: 'active',
        expiresAt: { $lt: now },
      })
      .lean()

    return holds.map((h) => this.toEntity(h))
  }

  async markHoldAsExpired(holdId: string): Promise<void> {
    await this.model.updateOne({ holdId }, { $set: { status: 'expired' } })
  }
}
