
export interface ICreateRatingsAndReviewsUseCase {
    execute(input: CreateRatingsAndReviewsRequestDTO): Promise<CreateRatingsAndReviewsResponseDTO>
}

export interface CreateRatingsAndReviewsRequestDTO {
    rating: number
    review: string
    serviceId: string
    customerId: string
}

export interface CreateRatingsAndReviewsResponseDTO {
    _id?: string
    rating: number
    review: string
    serviceRef: string
    customerRef: string
    isActive: boolean
    createdAt?: Date
    updatedAt?: Date
}
