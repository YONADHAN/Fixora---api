import { container } from 'tsyringe'
import { IAiServiceRepository } from '../../../../domain/repositoryInterfaces/feature/ai/ai_service_repository.interface'
import { AIToolBundle, AIToolContext } from '../../../../shared/types/ai/ai.types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getServiceTools(context: AIToolContext): AIToolBundle {
  const repo = container.resolve<IAiServiceRepository>('IAiServiceRepository')

  return {
    tools: [
      {
        functionDeclarations: [
          {
            name: 'getTopServices',
            description: 'Get top Fixora services',
          },
          {
            name: 'searchServices',
            description: 'Search Fixora services',
            parameters: {
              type: 'object',
              properties: {
                query: { type: 'string' },
              },
            },
          },
        ],
      },
    ],

    toolMap: {
      getTopServices: async () => {
        return repo.getTopServices()
      },

      searchServices: async ({ query }: { query: string }) => {
        return repo.searchServices(query)
      },
    },
  }
}
