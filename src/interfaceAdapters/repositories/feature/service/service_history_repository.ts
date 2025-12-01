import { injectable } from 'tsyringe'
import {
  ServiceHistoryModel,
  IServiceHistoryModel,
} from '../../../database/mongoDb/models/service_history_model'
import { BaseRepository } from '../../base_repository'
import { IServiceHistoryRepository } from '../../../../domain/repositoryInterfaces/feature/service/service_history_repository.interface'
import { IServiceHistoryEntity } from '../../../../domain/models/service_history_entity'
import { Schema } from 'mongoose'

@injectable()
export class ServiceHistoryRepository
  extends BaseRepository<IServiceHistoryModel, IServiceHistoryEntity>
  implements IServiceHistoryRepository
{
  constructor() {
    super(ServiceHistoryModel)
  }

  // DOMAIN → DB
  protected toModel(
    entity: Partial<IServiceHistoryEntity>
  ): Partial<IServiceHistoryModel> {
    return {
      serviceRef: entity.serviceRef
        ? new Schema.Types.ObjectId(entity.serviceRef)
        : undefined,

      historyId: entity.historyId,
      title: entity.title,
      description: entity.description,
      images: entity.images,
      completedOn: entity.completedOn,
    }
  }

  // DB → DOMAIN
  protected toEntity(model: IServiceHistoryModel): IServiceHistoryEntity {
    return {
      _id: model._id.toString(),
      serviceRef: model.serviceRef.toString(),

      historyId: model.historyId,
      title: model.title,
      description: model.description,
      images: model.images,
      completedOn: model.completedOn,

      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }
}
