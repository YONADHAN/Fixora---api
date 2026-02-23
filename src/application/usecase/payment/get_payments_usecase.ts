import { inject, injectable } from 'tsyringe'
import { PaymentHistoryFactory } from '../../factories/payment_history_factory/payment_history_factory'
import {
    GetPaymentHistoryRequestDTO,
    GetPaymentHistoryResponseDTO,
} from '../../dtos/payment_dto'

@injectable()
export class GetPaymentsUseCase {
    constructor(
        @inject(PaymentHistoryFactory)
        private readonly _paymentHistoryFactory: PaymentHistoryFactory
    ) { }

    async execute(
        payload: GetPaymentHistoryRequestDTO
    ): Promise<GetPaymentHistoryResponseDTO> {
        const strategy = this._paymentHistoryFactory.getStrategy(payload.role)
        return strategy.execute(payload)
    }
}
