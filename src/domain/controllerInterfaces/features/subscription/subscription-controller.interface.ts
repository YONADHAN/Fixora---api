import { Request, Response } from 'express'

export interface ISubscriptionController {
  createSubscriptionPlan(req: Request, res: Response): Promise<void>
  getAllSubscriptionPlans(req: Request, res: Response): Promise<void>
  updateSubscriptionPlan(req: Request, res: Response): Promise<void>
  toggleSubscriptionPlanStatus(req: Request, res: Response): Promise<void>
  getActiveSubscriptionPlans(req: Request, res: Response): Promise<void>
  createSubscriptionCheckout(req: Request, res: Response): Promise<void>
}
