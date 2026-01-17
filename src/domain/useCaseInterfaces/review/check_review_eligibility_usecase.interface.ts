export interface ICheckReviewEligibilityUseCase {
    execute(
        stripeCustomerId: string,
        serviceId: string
    ): Promise<{ canReview: boolean; message?: string; bookingId?: string }>
}
