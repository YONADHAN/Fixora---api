import { inject, injectable } from 'tsyringe';
import { IUserSubscriptionRepository } from '../../../domain/repositoryInterfaces/feature/subscription/user_subscription.interface';
import { CustomError } from '../../../domain/utils/custom.error';
import { HTTP_STATUS } from '../../../shared/constants';
import { stripe } from '../../../interfaceAdapters/stripe/stripe.client';
import { CreateCancelSubscriptionRequestDTO, CreateCancelSubscriptionResponseDTO } from '../../dtos/subscription_dto';
import { ICreateCancelSubscriptionUseCase } from '../../../domain/useCaseInterfaces/subscription/create_cancel_subscription_usecase.interface';

@injectable()
export class CreateCancelSubscriptionUseCase implements ICreateCancelSubscriptionUseCase {
    constructor(
        @inject('IUserSubscriptionRepository')
        private readonly _userSubscriptionRepository: IUserSubscriptionRepository,
    ) { }
    async execute(input: CreateCancelSubscriptionRequestDTO): Promise<CreateCancelSubscriptionResponseDTO> {
        const { userId, subscriptionId } = input

        const subscription = await this._userSubscriptionRepository.findOne({
            userId,
            status: 'active',
            subscriptionId,
        })

        if (!subscription) {
            throw new CustomError("Active subscription not found", HTTP_STATUS.NOT_FOUND)
        }

        if (!subscription.stripeSubscriptionId) {
            throw new CustomError('Stripe subscription missing', HTTP_STATUS.BAD_REQUEST)
        }


        await stripe.subscriptions.cancel(subscription.stripeSubscriptionId)

        return {
            subscriptionId,
            status: 'cancellation_initiated'
        }
    }
}