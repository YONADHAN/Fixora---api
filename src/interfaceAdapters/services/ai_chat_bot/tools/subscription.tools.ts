import { container } from 'tsyringe'
import { IAISubscriptionRepository } from '../../../../domain/repositoryInterfaces/feature/ai/ai_subscription_plan_repository.interface'
import { AIToolBundle, AIToolContext } from '../../../../shared/types/ai/ai.types'

export function getSubscriptionTools(context: AIToolContext): AIToolBundle {
  const repo = container.resolve<IAISubscriptionRepository>('IAISubscriptionRepository')

  if (context.role !== 'vendor' && context.role !== 'admin') {
    return { tools: [], toolMap: {} }
  }

  return {
    tools: [
      {
        functionDeclarations: [
          {
            name: 'getAvailableSubscriptionPlans',
            description: 'Fetch the available subscription plans (like VIP packs) that vendors or customers can purchase. The response includes pricing, duration, features, and benefits.',
            parameters: {
              type: 'object',
              properties: {},
            },
          },
        ],
      },
    ],

    toolMap: {
      getAvailableSubscriptionPlans: async () => {
        try {
          const plans = await repo.execute()
          
          if (!plans || plans.length === 0) {
            return {
              info: 'No active subscription plans could be found at this time. Please inform the user that currently no plans are available.'
            }
          }

          return plans
        } catch (error: unknown) {
          if (error instanceof Error) {
            return { error: `Failed to fetch subscription plans: ${error.message}` }
          }
          return { error: 'Failed to fetch subscription plans: Unknown error.' }
        }
      },
    },
  }
}
