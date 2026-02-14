import {
    GetPaymentHistoryRequestDTO,
    GetPaymentHistoryResponseDTO,
} from '../../../dtos/payment_dto'

export interface IGetPaymentHistoryStrategy {
    execute(
        payload: GetPaymentHistoryRequestDTO
    ): Promise<GetPaymentHistoryResponseDTO>
}

export interface IGetCustomerPaymentHistoryStrategy
    extends IGetPaymentHistoryStrategy { }

export interface IGetVendorPaymentHistoryStrategy
    extends IGetPaymentHistoryStrategy { }
