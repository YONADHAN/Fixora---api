import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe'

import { handleErrorResponse } from '../../../shared/utils/error_handler'
import { ICreateSubscriptionPlanUseCase } from '../../../domain/useCaseInterfaces/subscription/create_subscription_plan_usecase.interface'
import { IGetAllSubscriptionPlansUseCase } from '../../../domain/useCaseInterfaces/subscription/get_all_subscription_plans_usecase.interface'
import { IUpdateSubscriptionPlanUseCase } from '../../../domain/useCaseInterfaces/subscription/update_subscription_plan_usecase.interface'
import { IToggleSubscriptionPlanStatusUseCase } from '../../../domain/useCaseInterfaces/subscription/toggle_subscription_plan_status_usecase.interface'
import { CustomRequest } from '../../middleware/auth_middleware'
import { ISubscriptionController } from '../../../domain/controllerInterfaces/features/subscription/subscription-controller.interface'
import { IGetActiveSubscriptionPlansUseCase } from '../../../domain/useCaseInterfaces/subscription/get_active_subscription_plans_usecase.interface'
import { ICreateSubscriptionCheckoutUseCase } from '../../../domain/useCaseInterfaces/subscription/create_subscription_checkout_usecase.interface'
import { TRole } from '../../../shared/constants'

@injectable()
export class SubscriptionController implements ISubscriptionController {
  constructor(
    @inject('ICreateSubscriptionPlanUseCase')
    private readonly createSubscriptionPlanUseCase: ICreateSubscriptionPlanUseCase,

    @inject('IGetAllSubscriptionPlansUseCase')
    private readonly getAllSubscriptionPlansUseCase: IGetAllSubscriptionPlansUseCase,

    @inject('IUpdateSubscriptionPlanUseCase')
    private readonly updateSubscriptionPlanUseCase: IUpdateSubscriptionPlanUseCase,

    @inject('IToggleSubscriptionPlanStatusUseCase')
    private readonly toggleSubscriptionPlanStatusUseCase: IToggleSubscriptionPlanStatusUseCase,

    @inject('IGetActiveSubscriptionPlansUseCase')
    private readonly getActiveSubscriptionPlansUseCase: IGetActiveSubscriptionPlansUseCase,

    @inject('ICreateSubscriptionCheckoutUseCase')
    private readonly createSubscriptionCheckoutUseCase: ICreateSubscriptionCheckoutUseCase,
  ) {}

  async createSubscriptionPlan(
    req: CustomRequest,
    res: Response,
  ): Promise<void> {
    try {
      const adminId = (req as CustomRequest).user.userId
      if (!adminId) {
        res.status(401).json({ message: 'Unauthorized' })
        return
      }

      const result = await this.createSubscriptionPlanUseCase.execute({
        ...req.body,
        createdByAdminId: adminId,
      })

      res.status(201).json({
        message: 'Subscription plan created successfully',
        data: result,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }

  async getAllSubscriptionPlans(req: Request, res: Response): Promise<void> {
    try {
      const {
        page,
        limit,
        search = '',
      } = req.query as { page: string; limit: string; search: string }
      const plans = await this.getAllSubscriptionPlansUseCase.execute({
        page: Number(page),
        limit: Number(limit),
        search,
      })

      res.status(200).json({
        message: 'Subscription plans fetched successfully',
        data: plans,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }

  async updateSubscriptionPlan(
    req: CustomRequest,
    res: Response,
  ): Promise<void> {
    try {
      const planId = req.params.id

      const updatedPlan = await this.updateSubscriptionPlanUseCase.execute({
        planId,
        ...req.body,
      })

      res.status(200).json({
        message: 'Subscription plan updated successfully',
        data: updatedPlan,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }

  async toggleSubscriptionPlanStatus(
    req: CustomRequest,
    res: Response,
  ): Promise<void> {
    try {
      const planId = req.params.id

      const updatedPlan =
        await this.toggleSubscriptionPlanStatusUseCase.execute({ planId })

      res.status(200).json({
        message: 'Subscription plan status updated successfully',
        data: updatedPlan,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }

  async getActiveSubscriptionPlans(req: Request, res: Response): Promise<void> {
    try {
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 10
      const search =
        typeof req.query.search === 'string' ? req.query.search : ''

      const plans = await this.getActiveSubscriptionPlansUseCase.execute({
        page,
        limit,
        search,
      })

      res.status(200).json({
        message: 'Active subscription plans fetched successfully',
        data: plans,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }

  async createSubscriptionCheckout(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as CustomRequest).user?.userId
      const role = (req as CustomRequest).user?.role as TRole

      if (!userId || !role) {
        res.status(401).json({ message: 'Unauthorized' })
        return
      }

      const { planId } = req.body

      const checkout = await this.createSubscriptionCheckoutUseCase.execute({
        userId,
        role,
        planId,
      })

      res.status(200).json({
        message: 'Subscription checkout created successfully',
        data: checkout,
      })
    } catch (error) {
      console.error('SUBSCRIPTION CHECKOUT ERROR 👉', error)
      handleErrorResponse(req, res, error)
    }
  }
}
