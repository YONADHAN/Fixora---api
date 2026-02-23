import cron from 'node-cron'
import { container } from 'tsyringe'
import { IExpireBookingHoldsUseCase } from '../../domain/useCaseInterfaces/booking_hold/expire_booking_holds_usecase_interface'

export const startBookingHoldExpiryScheduler = () => {
  const useCase = container.resolve<IExpireBookingHoldsUseCase>(
    'IExpireBookingHoldsUseCase'
  )

  cron.schedule('* * * * *', async () => {
    try {
      await useCase.execute()
    } catch (err) {
      console.error('Booking hold expiry job failed', err)
    }
  })
}
