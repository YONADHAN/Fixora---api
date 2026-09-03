import { container } from 'tsyringe'
import { tool, StructuredToolInterface } from '@langchain/core/tools'
import { z } from 'zod'

import { AIToolContext } from '../../../../shared/types/ai/ai.types'
import { IAddressRepository } from '../../../../domain/repositoryInterfaces/feature/address/address_repository.interface'

export function getAddressTools(
  context: AIToolContext,
): { tools: StructuredToolInterface[] } {

  const getSavedAddressesTool = tool(
    async () => {
      try {
        if (!context.userId) return { error: 'User not authenticated' }

        const repo = container.resolve<IAddressRepository>('IAddressRepository')
        
        const addressResult = await repo.findAddressByCustomerId(
          1, 
          20, 
          undefined, 
          { customerId: context.userId }
        )

        if (!addressResult.data || addressResult.data.length === 0) {
          return { info: 'You have no saved addresses.' }
        }

        return addressResult.data.map(addr => ({
          id: addr._id,
          label: addr.label,
          type: addr.addressType,
          addressLine1: addr.addressLine1,
          addressLine2: addr.addressLine2,
          city: addr.city,
          state: addr.state,
          zipCode: addr.zipCode,
          country: addr.country,
          isDefault: addr.isDefault,
        }))
      } catch (error) {
        return { error: error instanceof Error ? error.message : 'Failed to fetch addresses' }
      }
    },
    {
      name: 'getSavedAddresses',
      description: 'List all of the saved locations/addresses for the logged-in user, including which one is the default.',
      schema: z.object({}),
    },
  )

  return {
    tools: [getSavedAddressesTool],
  }
}
