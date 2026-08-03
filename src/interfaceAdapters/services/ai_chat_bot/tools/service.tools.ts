import { container } from 'tsyringe'
import { tool, StructuredToolInterface } from '@langchain/core/tools'
import { z } from 'zod'

import { AIToolContext } from '../../../../shared/types/ai/ai.types'
import { IAiServiceRepository } from '../../../../domain/repositoryInterfaces/feature/ai/ai_service_repository.interface'

export function getServiceTools(
  _context: AIToolContext,
): { tools: StructuredToolInterface[] } {
  const repo =
    container.resolve<IAiServiceRepository>(
      'IAiServiceRepository',
    )

  const getTopServicesTool = tool(
    async () => {
      try {
        return await repo.getTopServices()
      } catch (error) {
        return {
          error:
            error instanceof Error
              ? error.message
              : 'Failed to fetch top services',
        }
      }
    },
    {
      name: 'getTopServices',
      description: 'Get the top services available on Fixora.',
      schema: z.object({}),
    },
  )

  const searchServicesTool = tool(
    async ({ query }) => {
      try {
        return await repo.searchServices(query)
      } catch (error) {
        return {
          error:
            error instanceof Error
              ? error.message
              : 'Failed to search services',
        }
      }
    },
    {
      name: 'searchServices',
      description:
        'Search Fixora services using keywords.',
      schema: z.object({
        query: z
          .string()
          .describe('Search term for finding services'),
      }),
    },
  )

  return {
    tools: [getTopServicesTool, searchServicesTool],
  }
}