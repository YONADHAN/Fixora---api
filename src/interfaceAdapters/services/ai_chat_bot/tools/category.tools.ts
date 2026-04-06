import { container } from 'tsyringe'
import { IAIMainServiceCategoryRepository } from '../../../../domain/repositoryInterfaces/feature/ai/ai_service_category_repository.interface'
import { AIToolBundle, AIToolContext } from '../../../../shared/types/ai/ai.types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getCategoryTools(context: AIToolContext): AIToolBundle {
  const repo = container.resolve<IAIMainServiceCategoryRepository>('IAIMainServiceCategoryRepository')

  return {
    tools: [
      {
        functionDeclarations: [
          {
            name: 'getMainServiceCategories',
            description: 'Fetch the main service categories available in the platform (e.g. Electrician, Plumbing, etc).',
            parameters: {
              type: 'object',
              properties: {},
            },
          },
        ],
      },
    ],

    toolMap: {
      getMainServiceCategories: async () => {
        try {
          const categories = await repo.findServiceCategories()
          
          if (!categories || categories.length === 0) {
            return {
              info: 'No main service categories could be found at this time.'
            }
          }

          return categories.map(c => ({
             id: c._id,
             serviceCategoryId: c.serviceCategoryId,
             name: c.name,
             description: c.description
          }))
        } catch (error: unknown) {
          if (error instanceof Error) {
            return { error: `Failed to fetch main service categories: ${error.message}` }
          }
          return { error: 'Failed to fetch main service categories: Unknown error.' }
        }
      },
    },
  }
}
