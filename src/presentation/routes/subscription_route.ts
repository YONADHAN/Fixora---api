import { BaseRoute } from './base_route'
import { verifyAuth } from '../middleware/auth_middleware'
import { authorizeRole } from '../middleware/auth_middleware'
import { subscriptionController } from '../di/resolver'

import { ROLES } from '../../shared/constants'

export class SubscriptionRoutes extends BaseRoute {
  constructor() {
    super()
  }

  protected initializeRoutes(): void {
    this.router.post(
      '/subscription-plans',
      verifyAuth,
      authorizeRole([ROLES.ADMIN]),
      (req, res) => {
        subscriptionController.createSubscriptionPlan(req, res)
      },
    )

    this.router.get('/subscription-plans', (req, res) => {
      subscriptionController.getAllSubscriptionPlans(req, res)
    })

    this.router.patch(
      '/subscription-plans/:id',
      verifyAuth,
      authorizeRole([ROLES.ADMIN]),
      (req, res) => {
        subscriptionController.updateSubscriptionPlan(req, res)
      },
    )

    this.router.patch(
      '/subscription-plans/:id/toggle',
      verifyAuth,
      authorizeRole([ROLES.ADMIN]),
      (req, res) => {
        subscriptionController.toggleSubscriptionPlanStatus(req, res)
      },
    )

    this.router.get('/subscription-plans/active', (req, res) =>
      subscriptionController.getActiveSubscriptionPlans(req, res),
    )

    this.router.post(
      '/checkout',
      verifyAuth,
      authorizeRole([ROLES.VENDOR]),
      (req, res) => subscriptionController.createSubscriptionCheckout(req, res),
    )
  }
}
