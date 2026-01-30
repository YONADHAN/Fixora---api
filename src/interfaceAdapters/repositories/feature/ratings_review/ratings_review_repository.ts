import { injectable } from 'tsyringe'
import { Schema, Types } from 'mongoose'
import { BaseRepository } from '../../base_repository'
import {
  RatingsReviewModel,
  IRatingsReviewModel,
} from '../../../database/mongoDb/models/ratings_review_model'
import { IRatingsReviewEntity } from '../../../../domain/models/ratings_review_entity'
import { RatingsReviewMongoBase } from '../../../database/mongoDb/types/ratings_review_mongo_base'
import { IRatingsReviewRepository } from '../../../../domain/repositoryInterfaces/feature/ratings_review/ratings_review_repository.interface'

@injectable()
export class RatingsReviewRepository
  extends BaseRepository<IRatingsReviewModel, IRatingsReviewEntity>
  implements IRatingsReviewRepository
{
  constructor() {
    super(RatingsReviewModel)
  }

  protected toEntity(model: RatingsReviewMongoBase): IRatingsReviewEntity {
    return {
      _id: model._id.toString(),
      ratingsReviewId: model.ratingsReviewId,
      rating: model.rating,
      review: model.review,
      serviceRef: model.serviceRef.toString(),
      customerRef: model.customerRef.toString(),
      isActive: model.isActive,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }

  protected toModel(
    entity: Partial<IRatingsReviewEntity>,
  ): Partial<IRatingsReviewModel> {
    return {
      ratingsReviewId: entity.ratingsReviewId,
      rating: entity.rating,
      review: entity.review,
      serviceRef: entity.serviceRef
        ? new Types.ObjectId(entity.serviceRef)
        : undefined,
      customerRef: entity.customerRef
        ? new Types.ObjectId(entity.customerRef)
        : undefined,
      isActive: entity.isActive ?? true,
    }
  }

  async findByServiceAndCustomer(
    serviceRef: string,
    customerRef: string,
  ): Promise<IRatingsReviewEntity | null> {
    const doc = await RatingsReviewModel.findOne({
      serviceRef: new Types.ObjectId(serviceRef),
      customerRef: new Types.ObjectId(customerRef),
      isActive: true,
    })

    return doc ? this.toEntity(doc) : null
  }

  async findByServicePaginated(
    serviceRef: string,
    limit: number,
    cursor?: string,
  ) {
    const query: any = {
      serviceRef: new Types.ObjectId(serviceRef),
      isActive: true,
    }

    if (cursor) {
      query._id = { $lt: new Types.ObjectId(cursor) }
    }

    const docs = await RatingsReviewModel.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .populate({
        path: 'customerRef',
        select: 'name profileImage',
      })
      .lean()

    return docs.map((doc: any) => ({
      _id: doc._id.toString(),
      ratingsReviewId: doc.ratingsReviewId,
      rating: doc.rating,
      review: doc.review,
      serviceRef: doc.serviceRef.toString(),
      customer: {
        name: doc.customerRef?.name,
        profileImage: doc.customerRef?.profileImage,
      },
      createdAt: doc.createdAt,
    }))
  }

  async findByCustomerAndServices(
    customerRef: string,
    serviceRefs: string[],
  ): Promise<IRatingsReviewEntity[]> {
    if (!serviceRefs.length) return []

    const docs = await RatingsReviewModel.find({
      customerRef: new Types.ObjectId(customerRef),
      serviceRef: {
        $in: serviceRefs.map((id) => new Types.ObjectId(id)),
      },
      isActive: true,
    })

    return docs.map((doc) => this.toEntity(doc))
  }

  async softDelete(id: string): Promise<boolean> {
    const res = await RatingsReviewModel.updateOne(
      { _id: new Types.ObjectId(id) },
      { isActive: false },
    )

    return res.modifiedCount > 0
  }
}
