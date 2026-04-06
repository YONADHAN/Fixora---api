import { inject, injectable } from 'tsyringe'
import { IRatingReviewController } from '../../../domain/controllerInterfaces/features/rating_review/review-controller.interface'
import { Request, Response } from 'express'
import { handleErrorResponse } from '../../../shared/utils/error_handler'

import { HTTP_STATUS, SUCCESS_MESSAGES, TRole } from '../../../shared/constants'
import { CustomRequest } from '../../middleware/auth_middleware'
import { IGetRatingAndReviewForServiceUseCase } from '../../../domain/useCaseInterfaces/rating_review/get_rating_and_review_for_service_usecase.interface'
import { ICreateRatingsAndReviewsUseCase } from '../../../domain/useCaseInterfaces/rating_review/create_ratings_and_reviews_usecase.interface'
import { IEditRatingsAndReviewsUseCase } from '../../../domain/useCaseInterfaces/rating_review/edit_ratings_and_reviews_usecase.interface'
import { ISoftDeleteRatingsAndReviews } from '../../../domain/useCaseInterfaces/rating_review/soft_delete_ratings_and_reviews_usecase.interface'
import { IGetRatingsAndReviewsForAllBookedServicesUseCase } from '../../../domain/useCaseInterfaces/rating_review/get_ratings_and_reviews_for_all_booked_service_usecase.interface'

@injectable()
export class RatingReviewController implements IRatingReviewController {
  constructor(
    @inject('IGetRatingAndReviewForServiceUseCase')
    private readonly _getRatingReviewForServiceUseCase: IGetRatingAndReviewForServiceUseCase,
    @inject('ICreateRatingsAndReviewsUseCase')
    private readonly _createRatingsAndReviewsUseCase: ICreateRatingsAndReviewsUseCase,
    @inject('IEditRatingsAndReviewsUseCase')
    private readonly _editRatingsAndReviewsUseCase: IEditRatingsAndReviewsUseCase,
    @inject('ISoftDeleteRatingsAndReviews')
    private readonly _softDeleteRatingsAndReview: ISoftDeleteRatingsAndReviews,
    @inject('IGetRatingsAndReviewsForAllBookedServicesUseCase')
    private readonly _getRatingsAndReviewsForAllBookedServicesUseCase: IGetRatingsAndReviewsForAllBookedServicesUseCase,
  ) {}

  async getRatingsAndReviews(req: Request, res: Response): Promise<void> {
    try {
      const { serviceId, limit, cursor } = req.query

      const response = await this._getRatingReviewForServiceUseCase.execute({
        serviceId: serviceId as string,
        limit: Number(limit),
        cursor: cursor ? String(cursor) : undefined,
      })

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.RATINGS_AND_REVIEWS_ARE_FETCHED_SUCCESFULLY,
        data: response,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }
  async createRatingsAndReviews(req: Request, res: Response): Promise<void> {
    try {
      const { rating, review, serviceId } = req.body
      const customerId = (req as CustomRequest).user.userId
      const response = await this._createRatingsAndReviewsUseCase.execute({
        rating,
        review,
        serviceId,
        customerId,
      })

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.SUCCESSFULLY_CREATED_RATINGS_AND_REVIEWS,
        data: response,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }
  async editRatingsAndReviews(req: Request, res: Response): Promise<void> {
    try {
      const { ratingsReviewId, rating, review } = req.body
      const customerId = (req as CustomRequest).user.userId
      const response = await this._editRatingsAndReviewsUseCase.execute({
        ratingsReviewId,
        rating,
        review,
        customerId,
      })
      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.SUCCESSFULLY_EDITED_THE_RATINGS_AND_REVIEWS,
        data: response,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }
  async softDeleteRatingsAndReviews(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const { ratingsReviewId } = req.body
      const { userId, role } = (req as CustomRequest).user
      console.log('userId and role', userId, role)
      const response = await this._softDeleteRatingsAndReview.execute({
        ratingsReviewId,
        userId,
        role: role as TRole,
      })
      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.DELETED_THE_RATINGS_AND_REVIEWS_SUCCESSFULLY,
        data: response,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }

  async getRatingsAndReviewsForBooked(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const { page, limit, search = '', sortBy, sortOrder = 'asc' } = req.query
      const customerId = (req as CustomRequest).user.userId

      const response =
        await this._getRatingsAndReviewsForAllBookedServicesUseCase.execute({
          customerId,
          page: Number(page),
          limit: Number(limit),
          search: search.toString(),
          sortBy: sortBy as 'createdAt' | 'serviceName',
          sortOrder: sortOrder as 'asc' | 'desc',
        })
      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.GET_RATINGS_AND_REVIEWS_FOR_BOOKED_SERVICES,
        data: response,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }
}
