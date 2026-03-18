import { inject, injectable } from 'tsyringe'
import { IVendorRepository } from '../../../../domain/repositoryInterfaces/users/vendor_repository.interface'
import { VendorProfileMapper } from '../../../mappers/vendor/vendor_profile_mapper'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../../shared/constants'
import { IVendorProfileStrategy } from './vendor_profile_strategy.interface'
import {
  CustomerProfileInfoDTO,
  VendorProfileInfoDTO,
} from '../../../dtos/user_dto'
import { CustomError } from '../../../../domain/utils/custom.error'

@injectable()
export class VendorProfileStrategy implements IVendorProfileStrategy {
  constructor(
    @inject('IVendorRepository')
    private _VendorRepository: IVendorRepository
  ) {}

  async execute(params: {
    userId: string
  }): Promise<CustomerProfileInfoDTO | VendorProfileInfoDTO> {
    const { userId } = params
    const data = await this._VendorRepository.findOne({ userId })
    if (!data) throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND,HTTP_STATUS.NOT_FOUND)
    return VendorProfileMapper.toDTO(data)
  }
}
