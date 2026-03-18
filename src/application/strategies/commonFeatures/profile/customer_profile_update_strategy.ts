import { inject, injectable } from 'tsyringe'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../../shared/constants'
import { ICustomerRepository } from '../../../../domain/repositoryInterfaces/users/customer_repository.interface'
import { ICustomerProfileUpdateStrategy } from './customer_profile_update_strategy.interface'
import { ProfileUpdateDTO } from '../../../dtos/profile_update_dto';
import { ICustomerEntity } from '../../../../domain/models/customer_entity';
import { CustomError } from '../../../../domain/utils/custom.error';

@injectable()
export class CustomerProfileUpdateStrategy
  implements ICustomerProfileUpdateStrategy {
  constructor(
    @inject('ICustomerRepository')
    private _customerRepository: ICustomerRepository
  ) { }


  async execute({ data, userId }: { data: ProfileUpdateDTO; userId: string }) {


    const existingUser = await this._customerRepository.findOne({ userId })

    if (!existingUser) {
      throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
    }
    function isValidGeo(geo?: ICustomerEntity['geoLocation']) {
      return (
        geo?.type === 'Point' &&
        Array.isArray(geo.coordinates) &&
        geo.coordinates.length === 2 &&
        geo.coordinates.every((c) => typeof c === 'number')
      )
    }

    const hasValidExistingGeo = isValidGeo(existingUser.geoLocation)
    const hasValidIncomingGeo = isValidGeo(data.geoLocation)

    if (!hasValidExistingGeo && !hasValidIncomingGeo) {
      throw new CustomError(
        "GeoLocation is required. Please set your location.",
        HTTP_STATUS.BAD_REQUEST
      )
    }


    const updateData: Partial<ICustomerEntity> = {}

    if (data.name !== undefined) updateData.name = data.name
    if (data.email !== undefined) updateData.email = data.email
    if (data.phone !== undefined) updateData.phone = data.phone
    if (hasValidIncomingGeo) {
      updateData.geoLocation = data.geoLocation
    }
    if (data.location !== undefined) updateData.location = data.location
    if (data.profileImage !== undefined) updateData.profileImage = data.profileImage



    await this._customerRepository.update({ userId }, updateData)

  }
}
