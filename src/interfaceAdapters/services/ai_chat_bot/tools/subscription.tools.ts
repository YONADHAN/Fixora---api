import { container } from 'tsyringe'
import { tool, StructuredToolInterface } from '@langchain/core/tools'
import { z } from 'zod'

import { AIToolContext } from '../../../../shared/types/ai/ai.types'
import { IAISubscriptionRepository } from '../../../../domain/repositoryInterfaces/feature/ai/ai_subscription_plan_repository.interface'

export function getSubscriptionTools(
  context: AIToolContext,
): { tools: StructuredToolInterface[] } {
  if (
    context.role !== 'vendor' &&
    context.role !== 'admin'
  ) {
    return { tools: [] }
  }

  const repo =
    container.resolve<IAISubscriptionRepository>(
      'IAISubscriptionRepository',
    )

  const getAvailableSubscriptionPlansTool = tool(
    async () => {
      try {
        const plans = await repo.execute()

        if (!plans?.length) {
          return {
            info: 'No active subscription plans are currently available.',
          }
        }

        return plans
      } catch (error) {
        return {
          error:
            error instanceof Error
              ? error.message
              : 'Failed to fetch subscription plans',
        }
      }
    },
    {
      name: 'getAvailableSubscriptionPlans',
      description:
        'Fetch available Fixora subscription plans with pricing, duration, benefits, and features.',
      schema: z.object({}),
    },
  )

  return {
    tools: [getAvailableSubscriptionPlansTool],
  }
}