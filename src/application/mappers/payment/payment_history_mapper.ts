import { IPaymentEntity } from "../../../domain/models/payment_entity";
import { PaymentItemDTO } from '../../dtos/payment_dto';

export class PaymentHistoryResponseMapper {
    static toDTO(
        payments: (IPaymentEntity & { serviceName?: string; vendorName?: string; customerName?: string })[]
    ): PaymentItemDTO[] {
        return payments.map((payment) => {
            let amount = 0;

            if (payment.status === 'fully-paid') {
                amount = payment.slots?.reduce((acc: number, slot: IPaymentEntity['slots'][number]) => acc + slot.pricing.totalPrice, 0) || 0
            } else {
                amount = payment.slots?.reduce((acc: number, slot: IPaymentEntity['slots'][number]) => acc + slot.pricing.advanceAmount, 0) || 0
            }

            return {
                paymentId: payment.paymentId,
                bookingGroupId: payment.bookingGroupId,
                amount: amount,
                status: payment.status,
                date: payment.createdAt || new Date(),
                serviceName: payment.serviceName,
                vendorName: payment.vendorName,
                customerName: payment.customerName
            }
        })
    }
}
