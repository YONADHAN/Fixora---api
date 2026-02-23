import { injectable, inject } from 'tsyringe'
import { IUserMapperFactory, IUserMapper } from './user_mapper_factory'
import { CustomerSafeMapper } from '../customer/customer_safe_user_mapper'
import { VendorSafeMapper } from '../vendor/vendor_safe_user_mapper'
import { CustomError } from '../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../shared/constants'

@injectable()
export class UserMapperFactory implements IUserMapperFactory {
  constructor(
    @inject('ICustomerSafeMapper') private _customerMapper: CustomerSafeMapper,
    @inject('IVendorSafeMapper') private _vendorMapper: VendorSafeMapper
  ) {}

  getMapper(role: string): IUserMapper {
    switch (role) {
      case 'customer':
        return this._customerMapper
      case 'vendor':
        return this._vendorMapper
      default:
        throw new CustomError(
          ERROR_MESSAGES.INVALID_ROLE,
          HTTP_STATUS.BAD_REQUEST
        )
    }
  }
}
