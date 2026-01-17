export interface IReviewEntity {
    _id?: string
    reviewId: string
    bookingId: string
    serviceId: string
    customerId: string
    vendorId: string
    rating: number
    comment: string
    createdAt: Date
    isDeleted: boolean
}
