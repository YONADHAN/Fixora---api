import { inject, injectable } from 'tsyringe'
import { IGetVendorPaymentHistoryStrategy } from './get_payment_history_strategy.interface'
import {
    GetPaymentHistoryRequestDTO,
    GetPaymentHistoryResponseDTO,
} from '../../../dtos/payment_dto'
import { IPaymentRepository } from '../../../../domain/repositoryInterfaces/feature/payment/payment_repository.interface'
import { IVendorRepository } from '../../../../domain/repositoryInterfaces/users/vendor_repository.interface'
import { CustomError } from '../../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../../shared/constants'
import { PaymentHistoryResponseMapper } from '../../../mappers/payment/payment_history_mapper'

@injectable()
export class GetVendorPaymentHistoryStrategy
    implements IGetVendorPaymentHistoryStrategy {
    constructor(
        @inject('IPaymentRepository')
        private readonly _paymentRepository: IPaymentRepository,
        @inject('IVendorRepository')
        private readonly _vendorRepository: IVendorRepository
    ) { }

    async execute(
        payload: GetPaymentHistoryRequestDTO
    ): Promise<GetPaymentHistoryResponseDTO> {
        const { userId, page, limit } = payload

        const vendor = await this._vendorRepository.findOne({ userId })
        if (!vendor) {
            throw new CustomError(
                ERROR_MESSAGES.USER_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }

        const result = await this._paymentRepository.findAllPayments(page, limit, {
            vendorRef: vendor._id,
        })

        const data = PaymentHistoryResponseMapper.toDTO(result.data)

        return {
            data,
            currentPage: result.currentPage,
            totalPages: result.totalPages,
            totalCount: result.totalCount,
        }
    }
}
