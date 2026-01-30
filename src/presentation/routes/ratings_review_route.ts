import { BaseRoute } from './base_route'
import { authorizeRole, verifyAuth } from '../middleware/auth_middleware'
import { ratingsReviewController } from '../di/resolver'
import { ROLES } from '../../shared/constants'
import { Request, Response } from 'express'

export class RatingsReviewRoutes extends BaseRoute {
  constructor() {
    super()
  }

  protected initializeRoutes(): void {
    this.router.get('/', (req: Request, res: Response) => {
      ratingsReviewController.getRatingsAndReviews(req, res)
    })

    this.router.get(
      '/booked-services',
      verifyAuth,
      authorizeRole([ROLES.CUSTOMER]),
      (req: Request, res: Response) => {
        ratingsReviewController.getRatingsAndReviewsForBooked(req, res)
      },
    )

    this.router.post(
      '/',
      verifyAuth,
      authorizeRole([ROLES.CUSTOMER]),
      (req: Request, res: Response) => {
        ratingsReviewController.createRatingsAndReviews(req, res)
      },
    )

    this.router.patch(
      '/',
      verifyAuth,
      authorizeRole([ROLES.CUSTOMER]),
      (req: Request, res: Response) => {
        ratingsReviewController.editRatingsAndReviews(req, res)
      },
    )

    this.router.delete(
      '/',
      verifyAuth,
      authorizeRole([ROLES.ADMIN, ROLES.CUSTOMER]),
      (req: Request, res: Response) => {
        ratingsReviewController.softDeleteRatingsAndReviews(req, res)
      },
    )
  }
}
