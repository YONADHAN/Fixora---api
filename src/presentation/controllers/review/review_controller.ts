import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe'
import { ICreateReviewUseCase } from '../../../domain/useCaseInterfaces/review/create_review_usecase.interface'
import { IGetServiceReviewsUseCase } from '../../../domain/useCaseInterfaces/review/get_service_reviews_usecase.interface'
import { ICheckReviewEligibilityUseCase } from '../../../domain/useCaseInterfaces/review/check_review_eligibility_usecase.interface'
import { CustomRequest } from '../../middleware/auth_middleware'
import { HTTP_STATUS } from '../../../shared/constants'

import { IReviewController } from '../../../domain/controllerInterfaces/features/review/review-controller.interface'

@injectable()
export class ReviewController implements IReviewController {
  constructor(
    @inject('ICreateReviewUseCase')
    private createReviewUseCase: ICreateReviewUseCase,
    @inject('IGetServiceReviewsUseCase')
    private getServiceReviewsUseCase: IGetServiceReviewsUseCase,
    @inject('ICheckReviewEligibilityUseCase')
    private checkReviewEligibilityUseCase: ICheckReviewEligibilityUseCase
  ) {}

  async createReview(req: Request, res: Response) {
    try {
      const user = (req as CustomRequest).user
      const { serviceId, bookingId, rating, comment } = req.body

      const review = await this.createReviewUseCase.execute({
        serviceId,
        bookingId,
        vendorId: '', // Handled by UseCase via Booking lookup
        customerId: user.userId,
        rating,
        comment,
      })

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'Review created successfully',
        data: review,
      })
    } catch (error: any) {
      res.status(error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Failed to create review',
      })
    }
  }

  async getServiceReviews(req: Request, res: Response) {
    try {
      const { serviceId } = req.params
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10

      const result = await this.getServiceReviewsUseCase.execute(
        serviceId,
        page,
        limit
      )

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Reviews fetched successfully',
        data: result,
      })
    } catch (error: any) {
      res.status(error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Failed to fetch reviews',
      })
    }
  }

  async checkEligibility(req: Request, res: Response) {
    try {
      const user = (req as CustomRequest).user
      const { serviceId } = req.params

      console.log('service Id', serviceId)
      const result = await this.checkReviewEligibilityUseCase.execute(
        user.userId,
        serviceId
      )

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result,
      })
    } catch (error: any) {
      res.status(error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Failed to check eligibility',
      })
    }
  }
}
