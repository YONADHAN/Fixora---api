import { inject, injectable } from 'tsyringe'
import { IBookingHoldRepository } from '../../../domain/repositoryInterfaces/feature/booking/booking_hold_repository.interface'
import { IRedisSlotLockRepository } from '../../../domain/repositoryInterfaces/redis/redis_slot_lock_repository_interface'
import { IServiceRepository } from '../../../domain/repositoryInterfaces/feature/service/service_repository.interface'
import { ICreateBookingHoldUseCase } from '../../../domain/useCaseInterfaces/booking_hold/create_booking_hold_usecase_interface'
import {
  RequestCreateBookingHoldDTO,
  ResponseCreateBookingHoldDTO,
} from '../../dtos/booking_hold_dto'

import { randomUUID } from 'crypto'
import { CustomError } from '../../../domain/utils/custom.error'
import { CreateBookingHoldResponseMapper } from '../../mappers/booking_hold/create_booking_hold_mapper'
import { ICustomerRepository } from '../../../domain/repositoryInterfaces/users/customer_repository.interface'
import { HTTP_STATUS } from '../../../shared/constants'

@injectable()
export class CreateBookingHoldUseCase implements ICreateBookingHoldUseCase {
  constructor(
    @inject('IBookingHoldRepository')
    private _bookingHoldRepository: IBookingHoldRepository,

    @inject('IRedisSlotLockRepository')
    private _redisSlotLockRepository: IRedisSlotLockRepository,

    @inject('IServiceRepository')
    private _serviceRepository: IServiceRepository,

    @inject('ICustomerRepository')
    private _customerRepository: ICustomerRepository,
  ) { }

  async execute(
    validatedDTO: RequestCreateBookingHoldDTO,
    customerId: string,
  ): Promise<ResponseCreateBookingHoldDTO> {
    const { serviceId, slots, paymentMethod, addressId } = validatedDTO

    if (!slots.length) {
      throw new CustomError('At least one slot is required', 400)
    }

    const service = await this._serviceRepository.findOne({ serviceId })
    if (!service) {
      throw new CustomError('Service not found', 404)
    }

    if (!service.isActiveStatusByAdmin || !service.isActiveStatusByVendor) {
      throw new CustomError('Service is not active', 400)
    }

    const customer = await this._customerRepository.findOne({
      userId: customerId,
    })
    if (!customer || !customer._id) {
      throw new CustomError('Customer not found', 404)
    }

    if (!customer.status) {
      throw new CustomError('Customer is blocked', 403)
    }

    const lockedSlots: { date: string; start: string }[] = []

    try {
      // for (const slot of slots) {
      //   const locked = await this._redisSlotLockRepository.lockSlot(
      //     serviceId,
      //     slot.date,
      //     slot.start,
      //     customerId,
      //   )

      //   if (!locked) {
      //     throw new CustomError(
      //       `Slot ${slot.date} ${slot.start} is on hold`,
      //       HTTP_STATUS.CONFLICT,
      //     )
      //   }

      //   lockedSlots.push({ date: slot.date, start: slot.start })
      // }
      for (const slot of slots) {
        const locked = await this._redisSlotLockRepository.lockSlot(
          serviceId,
          slot.date,
          slot.start,
          customerId,
        )

        if (!locked) {
          const isLockedByOther =
            await this._redisSlotLockRepository.isLockedByOtherUser(
              serviceId,
              slot.date,
              slot.start,
              customerId
            )

          if (isLockedByOther) {
            throw new CustomError(
              `Slot ${slot.date} ${slot.start} is on hold by another user`,
              HTTP_STATUS.CONFLICT
            )
          }
        }

        lockedSlots.push({ date: slot.date, start: slot.start })
      }
      const totalAmount = slots.reduce((s, x) => s + x.pricePerSlot, 0)
      const advanceAmount = slots.reduce((s, x) => s + x.advancePerSlot, 0)

      const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

      const bookingHold = await this._bookingHoldRepository.save({
        holdId: `BKGRP_${randomUUID()}`,
        serviceRef: service._id,
        vendorRef: service.vendorRef,
        customerRef: customer._id.toString(),
        addressId,
        slots,
        pricing: {
          totalAmount,
          advanceAmount,
          remainingAmount: totalAmount - advanceAmount,
        },
        paymentMethod,
        status: 'active',
        expiresAt,
      })

      return CreateBookingHoldResponseMapper.toDTO(bookingHold)
    } catch (error) {
      await this._redisSlotLockRepository.releaseMultipleSlots(
        serviceId,
        lockedSlots,
        customerId,
      )
      throw error
    }
  }
}
