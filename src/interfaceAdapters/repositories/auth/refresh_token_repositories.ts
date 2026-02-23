import { injectable } from 'tsyringe'
import {
  IRefreshTokenModel,
  RefreshTokenModel,
} from '../../database/mongoDb/models/refresh_token_model'
import { BaseRepository } from '../base_repository'
import { IRefreshTokenEntity } from '../../../domain/models/refreshToken_entity'

@injectable()
export class RefreshTokenRepository extends BaseRepository<
  IRefreshTokenModel,
  IRefreshTokenEntity
> {
  constructor() {
    super(RefreshTokenModel)
  }
  protected toEntity(model: IRefreshTokenModel): IRefreshTokenEntity {
    return {
      token: model.token,
      user: model.user,
      userType: model.userType,
      expiresAt: model.expiresAt,
    }
  }

  protected toModel(
    entity: Partial<IRefreshTokenEntity>
  ): Partial<IRefreshTokenModel> {
    return {
      token: entity.token,
      user: entity.user,
      userType: entity.userType,
      expiresAt: entity.expiresAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }
  async revokeRefreshToken(token: string): Promise<void> {
    await RefreshTokenModel.deleteOne({ token })
  }
}
