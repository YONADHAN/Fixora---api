"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentHistoryResponseMapper = void 0;
class PaymentHistoryResponseMapper {
    static toDTO(payments) {
        return payments.map((payment) => {
            var _a, _b;
            let amount = 0;
            if (payment.status === 'fully-paid') {
                amount = ((_a = payment.slots) === null || _a === void 0 ? void 0 : _a.reduce((acc, slot) => acc + slot.pricing.totalPrice, 0)) || 0;
            }
            else {
                amount = ((_b = payment.slots) === null || _b === void 0 ? void 0 : _b.reduce((acc, slot) => acc + slot.pricing.advanceAmount, 0)) || 0;
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
            };
        });
    }
}
exports.PaymentHistoryResponseMapper = PaymentHistoryResponseMapper;
