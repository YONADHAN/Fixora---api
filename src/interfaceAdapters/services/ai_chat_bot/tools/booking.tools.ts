import { container } from 'tsyringe'
import { tool, StructuredToolInterface } from '@langchain/core/tools'
import { z } from 'zod'

import { AIToolContext } from '../../../../shared/types/ai/ai.types'
import { IAiBookingRepository } from '../../../../domain/repositoryInterfaces/feature/ai/ai_booking_repository.interface'
import { IGetBookingDetailsUseCase } from '../../../../domain/useCaseInterfaces/booking/get_booking_details_usecase_interface'

export function getBookingTools(
  context: AIToolContext,
): { tools: StructuredToolInterface[] } {
  const repo = container.resolve<IAiBookingRepository>(
    'IAiBookingRepository',
  )

  const getUpcomingBookingsTool = tool(
    async ({ limit }) => {
      try {
        if (!context.userId) {
          return { error: 'User not authenticated' }
        }

        return await repo.getBookingsForAI({
          role: context.role,
          userId: context.userId,
          status: 'scheduled',
          limit: limit ?? 10,
        })
      } catch (error) {
        return {
          error:
            error instanceof Error
              ? error.message
              : 'Failed to fetch upcoming bookings',
        }
      }
    },
    {
      name: 'getUpcomingBookings',
      description: 'Get upcoming scheduled Fixora bookings for the user.',
      schema: z.object({
        limit: z
          .number()
          .optional()
          .describe('Maximum number of bookings to return'),
      }),
    },
  )

  const getBookingDetailsTool = tool(
    async ({ bookingId }) => {
      try {
        if (!context.userId) {
          return { error: 'User not authenticated' }
        }

        if (
          context.role !== 'customer' &&
          context.role !== 'vendor' &&
          context.role !== 'admin'
        ) {
          return { error: 'Invalid role' }
        }

        const useCase =
          container.resolve<IGetBookingDetailsUseCase>(
            'IGetBookingDetailsUseCase',
          )

        return await useCase.execute({
          bookingId,
          userId: context.userId,
          role: context.role,
        })
      } catch (error) {
        return {
          error:
            error instanceof Error
              ? error.message
              : 'Failed to fetch booking details',
        }
      }
    },
    {
      name: 'getBookingDetails',
      description:
        'Get complete details of a booking including pricing, slot information, service details, and professional details.',
      schema: z.object({
        bookingId: z
          .string()
          .describe('Booking ID such as BOOK_123'),
      }),
    },
  )

  const getUserBookingsHistoryTool = tool(
    async ({ status, paymentStatus, limit }) => {
      try {
        if (!context.userId) {
          return { error: 'User not authenticated' }
        }

        const bookings = await repo.getBookingsForAI({
          role: context.role,
          userId: context.userId,
          status: status as 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | undefined,
          limit: limit ?? 15,
        })

        if (!bookings || bookings.length === 0) {
          return {
            info: `Zero bookings were found matching filters: status=${status}, paymentStatus=${paymentStatus}.`
          }
        }
        return bookings
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : 'Failed to fetch booking history',
        }
      }
    },
    {
      name: 'getUserBookingsHistory',
      description: 'Fetch the user\'s booking history. Use this to find cancelled, completed, or specific bookings.',
      schema: z.object({
        status: z.string().optional().describe('e.g. scheduled, in-progress, completed, cancelled'),
        paymentStatus: z.string().optional(),
        limit: z.number().optional(),
      }),
    }
  )

  return {
    tools: [getUpcomingBookingsTool, getBookingDetailsTool, getUserBookingsHistoryTool],
  }
}