import { inject, injectable } from 'tsyringe'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../../shared/constants'
import { IVendorRepository } from '../../../../domain/repositoryInterfaces/users/vendor_repository.interface'
import { IVendorProfileUpdateStrategy } from './vendor_profile_update_strategy.interface'
import { ProfileUpdateDTO } from '../../../dtos/profile_update_dto';
import { CustomError } from '../../../../domain/utils/custom.error';
import { IVendorEntity } from '../../../../domain/models/vendor_entity';

@injectable()
export class VendorProfileUpdateStrategy
  implements IVendorProfileUpdateStrategy {
  constructor(
    @inject('IVendorRepository')
    private _vendorRepository: IVendorRepository
  ) { }

  

 async execute({data,userId}:{data: ProfileUpdateDTO; userId: string}) {
  const existingUser = await this._vendorRepository.findOne({userId})

  if(!existingUser) {
    throw new CustomError(ERROR_MESSAGES.USERS_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }
  function isValidGeo(geo?: IVendorEntity['geoLocation']) {
      return (
        geo?.type === 'Point' &&
        Array.isArray(geo.coordinates) &&
        geo.coordinates.length === 2 &&
        geo.coordinates.every((c) => typeof c === 'number')
      )
    }

    const hasValidExistingGeo = isValidGeo(existingUser.geoLocation)
    const hasValidIncomingGeo= isValidGeo(data.geoLocation)

    if(!hasValidExistingGeo && !hasValidIncomingGeo) {
      throw new CustomError("GeoLocation is required. Please set your location.",HTTP_STATUS.BAD_REQUEST)
    } 

   const updateData: Partial<IVendorEntity> = {}

    if (data.name !== undefined) updateData.name = data.name
    if (data.email !== undefined) updateData.email = data.email
    if (data.phone !== undefined) updateData.phone = data.phone
    if (hasValidIncomingGeo) {
      updateData.geoLocation = data.geoLocation
    }
    if (data.location !== undefined) updateData.location = data.location
    if (data.profileImage !== undefined) updateData.profileImage = data.profileImage

    await this._vendorRepository.update({userId},updateData);

 }
}
