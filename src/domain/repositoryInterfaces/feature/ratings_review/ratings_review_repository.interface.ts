import { IRatingsReviewEntity } from '../../../models/ratings_review_entity'
import { ReviewWithUserDTO } from '../../../useCaseInterfaces/rating_review/get_rating_and_review_for_service_usecase.interface'
import { IBaseRepository } from '../../base_repository.interface'

export interface IRatingsReviewRepository extends IBaseRepository<IRatingsReviewEntity> {
  findByServiceAndCustomer(
    serviceRef: string,
    customerRef: string,
  ): Promise<IRatingsReviewEntity | null>

  findByCustomerAndServices(
    customerRef: string,
    serviceRefs: string[],
  ): Promise<IRatingsReviewEntity[]>

  findByServicePaginated(
    serviceRef: string,
    limit: number,
    cursor?: string,
  ): Promise<ReviewWithUserDTO[]>

  softDelete(id: string): Promise<boolean>
}
