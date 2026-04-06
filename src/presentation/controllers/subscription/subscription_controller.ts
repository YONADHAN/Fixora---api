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
import { HTTP_STATUS, TRole, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../../shared/constants'
import { ICheckSubscriptionForAllowUsingBenefitUseCase } from '../../../domain/useCaseInterfaces/subscription/check_subscription_for_allow_using_benefit_usecase.interface'
import { IGetMySubscriptionPlansUseCase } from '../../../domain/useCaseInterfaces/subscription/get_my_subscription_plans_usecase.interface'
import { ICreateCancelSubscriptionUseCase } from '../../../domain/useCaseInterfaces/subscription/create_cancel_subscription_usecase.interface'

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

    @inject('ICheckSubscriptionForAllowUsingBenefitUseCase')
    private readonly _checkSubscriptionForAllowUsingBenefitUseCase: ICheckSubscriptionForAllowUsingBenefitUseCase,
  
    @inject('IGetMySubscriptionPlansUseCase')
    private readonly _getMySubscriptionPlansUsecase: IGetMySubscriptionPlansUseCase,

    @inject('ICreateCancelSubscriptionUseCase')
    private readonly _createCancelSubscriptionUseCase: ICreateCancelSubscriptionUseCase,
  ) {}

  async createSubscriptionPlan(
    req: CustomRequest,
    res: Response,
  ): Promise<void> {
    try {
      const adminId = (req as CustomRequest).user.userId
      if (!adminId) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: ERROR_MESSAGES.UNAUTHORIZED_USER })
        return
      }

      const result = await this.createSubscriptionPlanUseCase.execute({
        ...req.body,
        createdByAdminId: adminId,
      })

      res.status(HTTP_STATUS.CREATED).json({
        message: SUCCESS_MESSAGES.SUBSCRIPTION_PLAN_CREATED_SUCCESSFULLY,
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

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.SUBSCRIPTION_PLANS_FETCHED_SUCCESSFULLY,
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

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.SUBSCRIPTION_PLAN_UPDATED_SUCCESSFULLY,
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

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.SUBSCRIPTION_PLAN_STATUS_UPDATED_SUCCESSFULLY,
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

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.ACTIVE_SUBSCRIPTION_PLANS_FETCHED_SUCCESSFULLY,
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
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: ERROR_MESSAGES.UNAUTHORIZED_USER })
        return
      }

      const { planId } = req.body

      const checkout = await this.createSubscriptionCheckoutUseCase.execute({
        userId,
        role,
        planId,
      })

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.SUBSCRIPTION_CHECKOUT_CREATED_SUCCESSFULLY,
        data: checkout,
      })
    } catch (error) {
      console.error('SUBSCRIPTION CHECKOUT ERROR ', error)
      handleErrorResponse(req, res, error)
    }
  }


  async checkSubscriptionForAllowUsingBenefits(req:Request, res:Response): Promise<void> {
    try {
      const {userId, role} = (req as CustomRequest).user;
      const benefit = req.params.benefit;
      const response = await this._checkSubscriptionForAllowUsingBenefitUseCase.execute({role, userId, benefit});
      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.SUBSCRIPION_ELIGIBILITY_CHECKED_SUCCESSFULLY,
        data: response,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }

  async getMySubscriptionPlans(req:Request, res:Response): Promise<void> {
    try {
      const {userId,role} = (req as CustomRequest).user;
      const response = await this._getMySubscriptionPlansUsecase.execute({userId, role:role as TRole});
      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.SUBSCRIPTIONS_FETCHED_SUCCESSFULLY,
        data: response
      })
    } catch (error) {
      handleErrorResponse(req,res, error)
    }
  }

  async cancelMySubscriptionPlan(req:Request, res:Response): Promise<void> {
    try {
      const {userId} = (req as CustomRequest).user;
      const {subscriptionId} = req.body;
      const response = await this._createCancelSubscriptionUseCase.execute({userId, subscriptionId})
      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.SUBSCRIPTION_CANCELLED_SUCCESSFULLY,
        data: response,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }
}
