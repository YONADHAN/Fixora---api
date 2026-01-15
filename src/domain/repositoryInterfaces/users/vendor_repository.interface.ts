import { IVendorEntity } from '../../models/vendor_entity'
import { IBaseRepository } from '../base_repository.interface'
export interface IVendorRepository extends IBaseRepository<IVendorEntity> {
    findNearestVendors(
        lat: number,
        lng: number,
        radiusInKm: number
    ): Promise<IVendorEntity[]>
}
