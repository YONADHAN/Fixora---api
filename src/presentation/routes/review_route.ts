import { reviewController } from '../di/resolver'
import { authorizeRole, verifyAuth } from '../middleware/auth_middleware'
import { BaseRoute } from './base_route'
import { Request, Response } from 'express'
import { CustomRequestHandler } from '../../shared/types/custom_request'

export class ReviewRoutes extends BaseRoute {
  constructor() {
    super()
  }

  protected initializeRoutes(): void {

    this.router.get(
      '/services/:serviceId/reviews',
      (req: Request, res: Response) => {
        reviewController.getServiceReviews(req, res)
      }
    )


    this.router.post(
      '/reviews',
      verifyAuth as CustomRequestHandler,
      authorizeRole(['customer']),
      (req: Request, res: Response) => {
        reviewController.createReview(req, res)
      }
    )

    this.router.get(
      '/reviews/eligibility/:serviceId',
      verifyAuth as CustomRequestHandler,
      authorizeRole(['customer']),
      (req: Request, res: Response) => {
        reviewController.checkEligibility(req, res)
      }
    )
  }
}
