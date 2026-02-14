import { inject, injectable } from 'tsyringe'
import { IGetCustomerPaymentHistoryStrategy } from './get_payment_history_strategy.interface'
import {
    GetPaymentHistoryRequestDTO,
    GetPaymentHistoryResponseDTO,
} from '../../../dtos/payment_dto'
import { IPaymentRepository } from '../../../../domain/repositoryInterfaces/feature/payment/payment_repository.interface'
import { ICustomerRepository } from '../../../../domain/repositoryInterfaces/users/customer_repository.interface'
import { CustomError } from '../../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../../shared/constants'
import { PaymentHistoryResponseMapper } from '../../../mappers/payment/payment_history_mapper'

@injectable()
export class GetCustomerPaymentHistoryStrategy
    implements IGetCustomerPaymentHistoryStrategy {
    constructor(
        @inject('IPaymentRepository')
        private readonly _paymentRepository: IPaymentRepository,
        @inject('ICustomerRepository')
        private readonly _customerRepository: ICustomerRepository
    ) { }

    async execute(
        payload: GetPaymentHistoryRequestDTO
    ): Promise<GetPaymentHistoryResponseDTO> {
        const { userId, page, limit, search = "" } = payload

        const customer = await this._customerRepository.findOne({ userId })
        if (!customer) {
            throw new CustomError(
                ERROR_MESSAGES.USER_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }

        const result = await this._paymentRepository.findAllPayments(page, limit, {
            customerRef: customer._id,
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
