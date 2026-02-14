"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBookingByPaymentIdUseCase = void 0;
const tsyringe_1 = require("tsyringe");
let GetBookingByPaymentIdUseCase = class GetBookingByPaymentIdUseCase {
    constructor(_bookingRepository, _paymentRepository) {
        this._bookingRepository = _bookingRepository;
        this._paymentRepository = _paymentRepository;
    }
    execute(paymentId) {
        return __awaiter(this, void 0, void 0, function* () {
            // paymentId here is the Stripe Payment Intent ID
            const payment = yield this._paymentRepository.findOne({
                'advancePayment.stripePaymentIntentId': paymentId,
            });
            if (!payment) {
                // Fallback: Check if it's a Hold ID (in case we want to support that too, though less reliable as booking might not exist)
                // For now, strict payment intent lookup.
                return null;
            }
            if (!payment.slots || payment.slots.length === 0) {
                return null;
            }
            // Assuming we want the first booking associated with this payment
            // (In the current flow, one checkout = one hold = multiple slots = multiple bookings, but usually displayed together.
            // However, the success page is generic. Let's return the first one.)
            const bookingId = payment.slots[0].bookingId;
            const booking = yield this._bookingRepository.findOne({ bookingId });
            if (!booking) {
                return null;
            }
            return {
                bookingId: booking.bookingId,
                bookingGroupId: booking.bookingGroupId,
            };
        });
    }
};
exports.GetBookingByPaymentIdUseCase = GetBookingByPaymentIdUseCase;
exports.GetBookingByPaymentIdUseCase = GetBookingByPaymentIdUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IBookingRepository')),
    __param(1, (0, tsyringe_1.inject)('IPaymentRepository')),
    __metadata("design:paramtypes", [Object, Object])
], GetBookingByPaymentIdUseCase);
