import { VendorRequestDTO } from '../../../application/dtos/vendor_dto'

export interface IGetAllVendorRequestsUseCase {
  execute({
    page,
    limit,
    search,
  }: {
    page: number
    limit: number
    search: string
  }): Promise<{
    data: VendorRequestDTO[]
    total: number
    totalPages: number
  }>
}
