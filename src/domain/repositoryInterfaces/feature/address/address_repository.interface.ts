import { FilterQuery } from 'mongoose'
import { IAddressEntity } from '../../../models/address_entity'
import { IBaseRepository } from '../../base_repository.interface'
import { IAddressModel } from '../../../../interfaceAdapters/database/mongoDb/models/address_model'

export interface IAddressRepository extends IBaseRepository<IAddressEntity> {
  findDefaultAddress(customerId: string): Promise<IAddressEntity | null>
  findAddressByCustomerId(
    page: number,
    limit: number,
    search?: string,
    extraFilters?: FilterQuery<IAddressModel>
  ): Promise<{
    data: IAddressEntity[]
    currentPage: number
    totalPages: number
  }>
  clearDefaultAddress(customerId: string): Promise<void>

  setDefaultAddress(customerId: string, addressId: string): Promise<void>
}
