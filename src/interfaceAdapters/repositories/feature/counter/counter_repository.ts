import { injectable } from 'tsyringe'
import { CounterModel, ICounterModel } from '../../../database/mongoDb/models/counter_model'
import { ICounterRepository } from '../../../../domain/repositoryInterfaces/feature/counter/counter_repository.interface'
import { BaseRepository } from '../../base_repository'
import { ICounterEntity } from '../../../../domain/models/counter_entity'
import { CounterMongoBase } from '../../../database/mongoDb/types/counter_mongo_base'
import { CustomError } from '../../../../domain/utils/custom.error'
import { HTTP_STATUS } from '../../../../shared/constants'
@injectable()
export class CounterRepository extends BaseRepository<ICounterModel, ICounterEntity> implements ICounterRepository {
    constructor() {
        super(CounterModel)
    }

    protected toEntity(model: CounterMongoBase): ICounterEntity {
        return {
            key: model.key,
            value: model.value,
        }
    }

    protected toModel(entity: Partial<ICounterEntity>): Partial<ICounterModel> {
        return {
            key: entity.key,
            value: entity.value,
        }
    }
    async increment(key: string): Promise<number> {
        const result = await CounterModel.findOneAndUpdate(
            { key },
            { $inc: { value: 1 } },
            {
                new: true,
                upsert: true,
            }
        )
        if(!result){
            throw new CustomError("Failed to increase counter",HTTP_STATUS.INTERNAL_SERVER_ERROR)
        }
        return result.value
    }


}