import { inject, injectable } from 'tsyringe'

import { IUserSubscriptionRepository } from '../../../../domain/repositoryInterfaces/feature/subscription/user_subscription.interface'
import { CustomError } from '../../../../domain/utils/custom.error'
import { HTTP_STATUS, ROLES } from '../../../../shared/constants'
import { IUserSubscriptionEntity } from '../../../../domain/models/user_subscription_entity'
import { IVendorEnsureActiveSubscriptionStrategy } from './vendor_subscription_access_strategy.interface'

@injectable()
export class VendorEnsureActiveSubscriptionStrategy implements IVendorEnsureActiveSubscriptionStrategy {
  constructor(
    @inject('IUserSubscriptionRepository')
    private readonly userSubscriptionRepo: IUserSubscriptionRepository,
  ) {}

  async execute(userId: string): Promise<IUserSubscriptionEntity> {
    const activeSubscription = await this.userSubscriptionRepo.findOne({
      userId,
      userRole: ROLES.VENDOR,
      status: 'active',
    })

    if (!activeSubscription) {
      throw new CustomError(
        'Active subscription required',
        HTTP_STATUS.PAYMENT_REQUIRED,
      )
    }

    return activeSubscription
  }
}
