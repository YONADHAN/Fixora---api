import { container } from 'tsyringe'
import { IAiBookingRepository } from '../../../../domain/repositoryInterfaces/feature/ai/ai_booking_repository.interface'
import { AIToolBundle, AIToolContext } from '../../../../shared/types/ai/ai.types'
import { IGetBookingDetailsUseCase } from '../../../../domain/useCaseInterfaces/booking/get_booking_details_usecase_interface'

export function getBookingTools(context: AIToolContext): AIToolBundle {
  const repo = container.resolve<IAiBookingRepository>('IAiBookingRepository')

  return {
    tools: [
      {
        functionDeclarations: [
          {
            name: 'getUpcomingBookings',
            description: 'Get upcoming scheduled Fixora bookings for the user',
            parameters: {
              type: 'object',
              properties: {
                limit: { type: 'number' },
              },
            },
          },
          {
            name: 'getUserBookingsHistory',
            description: 'Fetch the user\'s personal booking history or specific bookings. You MUST use this tool to retrieve their upcoming, completed, or cancelled bookings. You have full access to their private bookings through this function.',
            parameters: {
              type: 'object',
              properties: {
                status: { type: 'string', description: 'e.g. scheduled, in-progress, completed, cancelled' },
                paymentStatus: { type: 'string' },
                limit: { type: 'number' },
              },
            },
          },
          {
            name: 'getBookingDetails',
            description: 'Get deep details of a specific booking including slot pricing, advance amounts, professional details, and exact service attributes.',
            parameters: {
              type: 'object',
              properties: {
                bookingId: { type: 'string', description: 'The bookingId or Appointment ID to lookup (e.g. BOOK_e4c6ca9d)' },
              },
              required: ['bookingId']
            },
          },
        ],
      },
    ],

    toolMap: {
      getUpcomingBookings: async ({ limit }: { limit?: number }) => {
        if (!context.userId) return []
        return repo.getBookingsForAI({
          role: context.role,
          userId: context.userId,
          status: 'scheduled',
          limit: limit || 10,
        })
      },

      getUserBookingsHistory: async ({
        status,
        paymentStatus,
        limit,
      }: {
        status?: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
        paymentStatus?:
        | 'pending'
        | 'advance-paid'
        | 'paid'
        | 'fully-paid'
        | 'pending-refund'
        | 'refunded'
        | 'failed'
        limit?: number
      }) => {
        if (!context.userId) return { error: "User not authenticated" }
        const bookings = await repo.getBookingsForAI({
          role: context.role,
          userId: context.userId,
          limit: limit || 15,
        })

        if (!bookings || bookings.length === 0) {
          return {
            info: `Zero bookings were found in the database. Tell the user firmly that they have no bookings matching these specific filters: status=${status}, paymentStatus=${paymentStatus}. Maybe they should check a different status?`
          }
        }

        return bookings
      },

      getBookingDetails: async ({ bookingId }: { bookingId: string }) => {
        if (!context.userId || !context.role || context.role === 'public') {
          return { error: 'User context is missing or you are totally public.' }
        }
        try {
          const detailUseCase = container.resolve<IGetBookingDetailsUseCase>('IGetBookingDetailsUseCase')
          if (!detailUseCase) return { error: 'Detail service unavailable.' }
          const details = await detailUseCase.execute({
            bookingId,
            userId: context.userId,
            role: context.role as 'customer' | 'vendor' | 'admin'
          })
          return details
        } catch (error: unknown) {
          if (error instanceof Error) {
            return { error: `Failed to fetch booking details for ${bookingId}: ${error.message}` }
          }
          return { error: `Failed to fetch booking details for ${bookingId}: Unknown error` }
        }
      },
    },
  }
}
