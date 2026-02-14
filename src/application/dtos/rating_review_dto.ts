export interface SoftDeleteRatingsAndReviewsRequestDTO {
  ratingsReviewId: string
  userId: string
  role: string
}

export interface SoftDeleteRatingsAndReviewsResponseDTO {
  ratingsReviewId: string
  rating: number
  review: string
  isActive: boolean
}

export interface GetRatingsAndReviewsForBookedServicesRequestDTO {
  customerId: string
  page: number
  limit: number
  search?: string
  sortBy: 'createdAt' | 'serviceName'
  sortOrder: 'asc' | 'desc'
}
export interface RatingsAndReviewServiceCardDTO {
  serviceRef: string
  serviceId: string
  serviceName: string
  serviceImage?: string
  mainImage: string
  isReviewed: boolean
  rating?: number
  review?: string
  ratingReviewId?: string
}

export interface GetRatingsAndReviewsForBookedServicesResponseDTO {
  data: RatingsAndReviewServiceCardDTO[]
  currentPage: number
  totalPages: number
}

export interface ReviewWithUserDTO {
  rating: number
  review: string
  createdAt: Date
  customer: {
    name: string
    profileImage?: string
  }
}
