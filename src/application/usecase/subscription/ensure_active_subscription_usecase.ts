import { inject, injectable } from 'tsyringe'
import { SubscriptionAccessStrategyFactory } from '../../factories/subscription/subscription_access_strategy.factory'
import { IUserSubscriptionEntity } from '../../../domain/models/user_subscription_entity'
import { IEnsureActiveSubscriptionUseCase } from '../../../domain/useCaseInterfaces/subscription/ensure_active_subscription_usecase.interface'

@injectable()
export class EnsureActiveSubscriptionUseCase implements IEnsureActiveSubscriptionUseCase {
  constructor(
    @inject(SubscriptionAccessStrategyFactory)
    private readonly strategyFactory: SubscriptionAccessStrategyFactory,
  ) {}

  async execute(
    userId: string,
    role: string,
  ): Promise<IUserSubscriptionEntity | null> {
    const strategy = this.strategyFactory.getStrategy(role)

    if (!strategy) {
      return null
    }

    return strategy.execute(userId)
  }
}
