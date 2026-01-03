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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerCancelBookingStrategy = void 0;
const tsyringe_1 = require("tsyringe");
const crypto_1 = __importDefault(require("crypto"));
const custom_error_1 = require("../../../../domain/utils/custom.error");
const constants_1 = require("../../../../shared/constants");
let CustomerCancelBookingStrategy = class CustomerCancelBookingStrategy {
    constructor(_customerRepository, _bookingRepository, _paymentRepository, _walletRepository, _walletTransactionRepository) {
        this._customerRepository = _customerRepository;
        this._bookingRepository = _bookingRepository;
        this._paymentRepository = _paymentRepository;
        this._walletRepository = _walletRepository;
        this._walletTransactionRepository = _walletTransactionRepository;
    }
    execute(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, bookingId, reason, role } = payload;
            const booking = yield this._bookingRepository.findOne({ bookingId });
            if (!booking) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.NO_BOOKING_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
            }
            const user = yield this._customerRepository.findOne({ userId });
            if (!user || !user._id) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.FILE_NOT_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
            }
            if (booking.customerRef !== user._id.toString()) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.CONFLICTING_INPUTS, constants_1.HTTP_STATUS.CONFLICT);
            }
            const payment = yield this._paymentRepository.findOne({
                bookingGroupId: booking.bookingGroupId,
            });
            if (!payment) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.FILE_NOT_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
            }
            const wallet = yield this._walletRepository.findOne({
                userRef: booking.customerRef,
            });
            if (!wallet || !wallet._id) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.FILE_NOT_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
            }
            yield this._walletTransactionRepository.save({
                transactionId: `WTXN_${crypto_1.default.randomUUID()}`,
                walletRef: wallet._id,
                userRef: booking.customerRef,
                type: 'credit',
                source: 'booking-refund',
                amount: payment.advancePayment.amount,
                currency: payment.advancePayment.currency,
                description: `Refund for cancelled booking ${booking.bookingId}`,
                paymentRef: payment._id,
            });
            yield this._paymentRepository.updateSlotAdvanceRefund(payment.paymentId, booking.bookingId, {
                refundId: `REF_${crypto_1.default.randomUUID()}`,
                amount: payment.advancePayment.amount,
                status: 'succeeded',
                initiatedBy: role,
                initiatedByUserId: user._id.toString(),
                createdAt: new Date(),
                failures: [],
            });
            yield this._bookingRepository.update({ bookingId }, {
                cancelInfo: {
                    cancelledByRef: user._id.toString(),
                    cancelledByRole: role,
                    reason,
                    cancelledAt: new Date(),
                },
                serviceStatus: 'cancelled',
            });
        });
    }
};
exports.CustomerCancelBookingStrategy = CustomerCancelBookingStrategy;
exports.CustomerCancelBookingStrategy = CustomerCancelBookingStrategy = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('ICustomerRepository')),
    __param(1, (0, tsyringe_1.inject)('IBookingRepository')),
    __param(2, (0, tsyringe_1.inject)('IPaymentRepository')),
    __param(3, (0, tsyringe_1.inject)('IWalletRepository')),
    __param(4, (0, tsyringe_1.inject)('IWalletTransactionRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], CustomerCancelBookingStrategy);
