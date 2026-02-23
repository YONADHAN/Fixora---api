import { Request, Response } from 'express'

export interface IRatingReviewController {
  getRatingsAndReviews(req: Request, res: Response): Promise<void>
  createRatingsAndReviews(req: Request, res: Response): Promise<void>
  editRatingsAndReviews(req: Request, res: Response): Promise<void>
  softDeleteRatingsAndReviews(req: Request, res: Response): Promise<void>
  getRatingsAndReviewsForBooked(req: Request, res: Response): Promise<void>
}
