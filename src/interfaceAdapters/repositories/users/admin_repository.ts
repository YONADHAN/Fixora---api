import { injectable } from 'tsyringe'
import {
  AdminModel,
  IAdminModel,
} from '../../database/mongoDb/models/admin_model'
import { BaseRepository } from '../base_repository'
import { IAdminRepository } from '../../../domain/repositoryInterfaces/users/admin_repository.interface'
import { IAdminEntity } from '../../../domain/models/admin_entity'

@injectable()
export class AdminRepository
  extends BaseRepository<IAdminModel, IAdminEntity>
  implements IAdminRepository
{
  constructor() {
    super(AdminModel)
  }

  protected toEntity(model: IAdminModel): IAdminEntity {
    return {
      userId: model.userId,
      _id: model._id, //-------------------------------
      name: model.name,
      email: model.email,
      phone: model.phone,
      password: model.password,
      role: model.role,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }
}
