import { NextFunction, Response } from 'express'
import { container } from 'tsyringe'
import { CustomError } from '../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../shared/constants'
import { CustomRequest } from './auth_middleware'
import { IEnsureActiveSubscriptionUseCase } from '../../domain/useCaseInterfaces/subscription/ensure_active_subscription_usecase.interface'

export const ensureActiveSubscriptionFeature = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId
    const role = req.user?.role

    if (!userId || !role) {
      throw new CustomError(
        ERROR_MESSAGES.UNAUTHORIZED,
        HTTP_STATUS.UNAUTHORIZED,
      )
    }

    const useCase = container.resolve<IEnsureActiveSubscriptionUseCase>(
      'IEnsureActiveSubscriptionUseCase',
    )

    const subscription = await useCase.execute(userId, role)

    if (subscription) {
      req.subscription = subscription
    }

    next()
  } catch (error) {
    next(error)
  }
}
