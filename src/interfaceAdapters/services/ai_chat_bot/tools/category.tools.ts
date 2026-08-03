import { container } from 'tsyringe'
import { tool, StructuredToolInterface } from '@langchain/core/tools'
import { z } from 'zod'

import { AIToolContext } from '../../../../shared/types/ai/ai.types'
import { IAIMainServiceCategoryRepository } from '../../../../domain/repositoryInterfaces/feature/ai/ai_service_category_repository.interface'

export function getCategoryTools(
  _context: AIToolContext,
): { tools: StructuredToolInterface[] } {
  const repo =
    container.resolve<IAIMainServiceCategoryRepository>(
      'IAIMainServiceCategoryRepository',
    )

  const getMainServiceCategoriesTool = tool(
    async () => {
      try {
        const categories = await repo.findServiceCategories()

        if (!categories?.length) {
          return {
            info: 'No main service categories could be found at this time.',
          }
        }

        return categories.map((c) => ({
          id: c._id,
          serviceCategoryId: c.serviceCategoryId,
          name: c.name,
          description: c.description,
        }))
      } catch (error) {
        return {
          error:
            error instanceof Error
              ? error.message
              : 'Failed to fetch categories',
        }
      }
    },
    {
      name: 'getMainServiceCategories',
      description:
        'Fetch all main service categories available on Fixora.',
      schema: z.object({}),
    },
  )

  return {
    tools: [getMainServiceCategoriesTool],
  }
}