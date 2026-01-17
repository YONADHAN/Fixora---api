import { Request, Response } from 'express'

export interface IReviewController {
    createReview(req: Request, res: Response): Promise<void>
    getServiceReviews(req: Request, res: Response): Promise<void>
    checkEligibility(req: Request, res: Response): Promise<void>
}
