import { IBaseRepository } from '../../base_repository.interface'
import { IServiceHistoryEntity } from '../../../models/service_history_entity'

export interface IServiceHistoryRepository
  extends IBaseRepository<IServiceHistoryEntity> {}
