import { injectable } from 'tsyringe'
import {
  ServiceModel,
  IServiceModel,
} from '../../../database/mongoDb/models/service_model'
import { BaseRepository } from '../../base_repository'
import { IServiceRepository } from '../../../../domain/repositoryInterfaces/feature/service/service_repository.interface'

@injectable()
export class ServiceRepository
  extends BaseRepository<IServiceModel>
  implements IServiceRepository
{
  constructor() {
    super(ServiceModel)
  }

  async findByCategory(categoryId: string) {
    return this.model.find({ categoryId, isActive: true }).lean()
  }
}
