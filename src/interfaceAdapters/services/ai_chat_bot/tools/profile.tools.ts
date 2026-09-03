import { container } from 'tsyringe'
import { tool, StructuredToolInterface } from '@langchain/core/tools'
import { z } from 'zod'

import { AIToolContext } from '../../../../shared/types/ai/ai.types'
import { ICustomerRepository } from '../../../../domain/repositoryInterfaces/users/customer_repository.interface'

export function getProfileTools(
  context: AIToolContext,
): { tools: StructuredToolInterface[] } {

  const getProfileDetailsTool = tool(
    async () => {
      try {
        if (!context.userId) {
          return { error: 'User not authenticated' }
        }

        if (context.role === 'customer') {
          console.log(`[getProfileDetailsTool] Searching for customer with userId:`, context.userId)
          const repo = container.resolve<ICustomerRepository>('ICustomerRepository')
          const customer = await repo.findOne({ userId: context.userId })
          console.log(`[getProfileDetailsTool] Customer found:`, !!customer)
          
          if (!customer) return { error: 'Profile not found' }
          return {
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
          }
        }
        
        return { error: `Profile lookup for role ${context.role} not fully implemented yet.` }
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : 'Failed to fetch profile',
        }
      }
    },
    {
      name: 'getProfileDetails',
      description: 'Get the logged-in user\'s profile details including their name, email, and phone number.',
      schema: z.object({}),
    },
  )

  return {
    tools: [getProfileDetailsTool],
  }
}
