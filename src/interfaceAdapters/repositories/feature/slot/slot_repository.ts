import { injectable } from 'tsyringe'
import {
  ISlotModel,
  SlotModel,
} from '../../../database/mongoDb/models/slot_model'
import { ISlotEntity } from '../../../../domain/models/slot_entity'
import { BaseRepository } from '../../base_repository'
import { ISlotRepository } from '../../../../domain/repositoryInterfaces/feature/slot/slot_repository.interface'
import { Schema } from 'mongoose'

@injectable()
export class SlotRepository
  extends BaseRepository<ISlotModel, ISlotEntity>
  implements ISlotRepository
{
  constructor() {
    super(SlotModel)
  }

  protected toEntity(model: ISlotModel): ISlotEntity {
    return {
      _id: model._id.toString(),
      slotId: model.slotId,
      serviceRef: model.serviceRef.toString(),
      slotDate: model.slotDate,
      startTime: model.startTime,
      endTime: model.endTime,
      bookingStatus: model.bookingStatus,
      bookedBy: model.bookedBy ? model.bookedBy.toString() : undefined,
      bookingId: model.bookingId ? model.bookingId.toString() : undefined,
    }
  }

  protected toModel(entity: Partial<ISlotEntity>): Partial<ISlotModel> {
    return {
      slotId: entity.slotId,
      serviceRef: entity.serviceRef
        ? new Schema.Types.ObjectId(entity.serviceRef)
        : undefined,
      slotDate: entity.slotDate,
      startTime: entity.startTime,
      endTime: entity.endTime,
      bookingStatus: entity.bookingStatus,
      bookedBy: entity.bookedBy
        ? new Schema.Types.ObjectId(entity.bookedBy)
        : undefined,
      bookingId: entity.bookingId
        ? new Schema.Types.ObjectId(entity.bookingId)
        : undefined,
    }
  }
}
