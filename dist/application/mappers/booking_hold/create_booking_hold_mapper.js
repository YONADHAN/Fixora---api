"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBookingHoldResponseMapper = exports.CreateBookingHoldRequestMapper = void 0;
class CreateBookingHoldRequestMapper {
    static toDTO(basic) {
        return {
            serviceId: basic.serviceId.trim(),
            addressId: basic.addressId.trim(),
            paymentMethod: basic.paymentMethod,
            slots: basic.slots.map((slot) => {
                var _a;
                return ({
                    date: slot.date,
                    start: slot.start,
                    end: slot.end,
                    pricePerSlot: Number(slot.pricePerSlot),
                    advancePerSlot: Number(slot.advancePerSlot),
                    variant: slot.variant
                        ? {
                            name: (_a = slot.variant.name) === null || _a === void 0 ? void 0 : _a.trim(),
                            price: slot.variant.price,
                        }
                        : undefined,
                });
            }),
        };
    }
}
exports.CreateBookingHoldRequestMapper = CreateBookingHoldRequestMapper;
class CreateBookingHoldResponseMapper {
    static toDTO(response) {
        return {
            holdId: response.holdId,
            pricing: {
                totalAmount: response.pricing.totalAmount,
                advanceAmount: response.pricing.advanceAmount,
                remainingAmount: response.pricing.remainingAmount,
            },
            expiresAt: response.expiresAt,
        };
    }
}
exports.CreateBookingHoldResponseMapper = CreateBookingHoldResponseMapper;
