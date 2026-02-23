export interface IRatingsReviewEntity {
  _id?: string
  ratingsReviewId: string
  rating: number
  review: string
  serviceRef: string
  customerRef: string
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
}
