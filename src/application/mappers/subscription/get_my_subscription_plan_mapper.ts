
import { GetMySubscriptionResponseDTO, IUserSubscriptionWithPlan } from "../../dtos/subscription_dto";
export class GetMySubscriptionPlansResponseMapper {
  static toDTO(
    input: IUserSubscriptionWithPlan[]
  ): GetMySubscriptionResponseDTO {

    return {
      subscriptions: input.map((item) => ({
        subscriptionId: item.subscriptionId,
        userId: item.userId,
        userRole: item.userRole,

        status: item.status,
        startDate: item.startDate,
        endDate: item.endDate,
        autoRenew: item.autoRenew,
        paymentStatus: item.paymentStatus,

        plan: {
          planId: item.plan.planId,
          name: item.plan.name,
          description: item.plan.description,
          price: item.plan.price,
          durationInDays: item.plan.durationInDays,
          features: item.plan.features,
          benefits: item.plan.benefits,
        },
      })),
    }
  }
}