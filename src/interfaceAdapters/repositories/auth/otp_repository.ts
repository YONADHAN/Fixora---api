import { injectable } from 'tsyringe'
import { IOtpEntity } from '../../../domain/models/otp_entity'
import { IOtpModel, OtpModel } from '../../database/mongoDb/models/otp_model'
import { BaseRepository } from '../base_repository'

@injectable()
export class OtpRepository extends BaseRepository<IOtpModel, IOtpEntity> {
  constructor() {
    super(OtpModel)
  }
  protected toEntity(model: IOtpModel): IOtpEntity {
    return {
      otp: model.otp,
      email: model.email,
      expiresAt: model.expiresAt,
    }
  }

  protected toModel(entity: Partial<IOtpEntity>): Partial<IOtpModel> {
    return {
      otp: entity.otp,
      email: entity.email,
      expiresAt: entity.expiresAt,
    }
  }

  async findLatestOtp(email: string): Promise<IOtpEntity | null> {
    const result = await this.model
      .findOne({ email })
      .sort({ createdAt: -1 })
      .lean<IOtpModel>()

    return result ? this.toEntity(result) : null
  }
}
