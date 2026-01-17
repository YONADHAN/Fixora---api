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
exports.StripePaymentSucceededUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const crypto_1 = __importDefault(require("crypto"));
const uuid_1 = require("uuid");
let StripePaymentSucceededUseCase = class StripePaymentSucceededUseCase {
    constructor(_bookingHoldRepository, _bookingRepository, _redisSlotLockRepository, _paymentRepository, _walletTransactionRepository, _walletRepository, _createNotificationUseCase, _customerRepository, _vendorRepository, _chatRepository, _serviceRepository) {
        this._bookingHoldRepository = _bookingHoldRepository;
        this._bookingRepository = _bookingRepository;
        this._redisSlotLockRepository = _redisSlotLockRepository;
        this._paymentRepository = _paymentRepository;
        this._walletTransactionRepository = _walletTransactionRepository;
        this._walletRepository = _walletRepository;
        this._createNotificationUseCase = _createNotificationUseCase;
        this._customerRepository = _customerRepository;
        this._vendorRepository = _vendorRepository;
        this._chatRepository = _chatRepository;
        this._serviceRepository = _serviceRepository;
    }
    execute(paymentIntent) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const hold = (_a = (yield this._bookingHoldRepository.findByStripePaymentIntentId(paymentIntent.id))) !== null && _a !== void 0 ? _a : (yield this._bookingHoldRepository.findOne({
                holdId: (_b = paymentIntent.metadata) === null || _b === void 0 ? void 0 : _b.holdId,
            }));
            if (!hold || hold.status !== 'active')
                return;
            const createdBookings = [];
            for (const slot of hold.slots) {
                const booking = yield this._bookingRepository.save({
                    bookingId: `BOOK_${crypto_1.default.randomUUID()}`,
                    bookingGroupId: hold.holdId,
                    serviceRef: hold.serviceRef,
                    vendorRef: hold.vendorRef,
                    customerRef: hold.customerRef,
                    addressId: hold.addressId,
                    date: slot.date,
                    slotStart: new Date(`${slot.date}T${slot.start}`),
                    slotEnd: new Date(`${slot.date}T${slot.end}`),
                    paymentStatus: 'advance-paid',
                    serviceStatus: 'scheduled',
                });
                createdBookings.push({
                    bookingId: booking.bookingId,
                    pricing: {
                        totalPrice: slot.pricePerSlot,
                        advanceAmount: slot.advancePerSlot,
                        remainingAmount: slot.pricePerSlot - slot.advancePerSlot,
                    },
                });
            }
            //creating payment
            const payment = yield this._paymentRepository.save({
                paymentId: `PAY_${crypto_1.default.randomUUID()}`,
                bookingGroupId: hold.holdId,
                serviceRef: hold.serviceRef,
                vendorRef: hold.vendorRef,
                customerRef: hold.customerRef,
                advancePayment: {
                    stripePaymentIntentId: paymentIntent.id,
                    amount: hold.pricing.advanceAmount,
                    currency: 'INR',
                    status: 'paid',
                    paidAt: new Date(),
                    failures: [],
                },
                slots: createdBookings.map((b) => ({
                    bookingId: b.bookingId,
                    pricing: b.pricing,
                    status: 'advance-paid',
                })),
                status: 'advance-paid',
            });
            let wallet = yield this._walletRepository.findOne({
                userRef: hold.customerRef,
            });
            if (!wallet) {
                wallet = yield this._walletRepository.save({
                    walletId: `WAL_${crypto_1.default.randomUUID()}`,
                    userRef: hold.customerRef,
                    userType: 'customer',
                    currency: 'INR',
                    isActive: true,
                    balance: 0,
                });
            }
            yield this._walletTransactionRepository.save({
                transactionId: `WTXN_${crypto_1.default.randomUUID()}`,
                walletRef: wallet._id,
                userRef: hold.customerRef,
                type: 'debit',
                source: 'service-booking',
                amount: hold.pricing.advanceAmount,
                currency: 'INR',
                description: `Advance payment for ${hold.holdId}`,
                bookingHoldRef: hold._id,
                paymentRef: payment._id,
                stripePaymentIntentId: paymentIntent.id,
            });
            yield this._bookingHoldRepository.markHoldAsCompleted(hold.holdId);
            for (const slot of hold.slots) {
                yield this._redisSlotLockRepository.releaseSlot(hold.serviceRef, slot.date, slot.start);
            }
            const customer = yield this._customerRepository.findOne({
                _id: hold.customerRef,
            });
            const vendor = yield this._vendorRepository.findOne({
                _id: hold.vendorRef,
            });
            if (customer) {
                yield this._createNotificationUseCase.execute({
                    recipientId: customer.userId,
                    recipientRole: 'customer',
                    type: 'PAYMENT_SUCCESS',
                    title: 'Payment Successful',
                    message: `Advance payment successful for booking group ${hold.holdId}`,
                    metadata: { bookingId: hold.holdId },
                });
            }
            if (vendor) {
                yield this._createNotificationUseCase.execute({
                    recipientId: vendor.userId,
                    recipientRole: 'vendor',
                    type: 'PAYMENT_SUCCESS',
                    title: 'New Payment Received',
                    message: `New advance payment received for booking group ${hold.holdId}`,
                    metadata: { bookingId: hold.holdId },
                });
            }
            // Chat Creation Logic
            if (customer && vendor && customer._id && vendor._id) {
                const service = yield this._serviceRepository.findOne({
                    _id: hold.serviceRef,
                });
                if (service && service._id) {
                    const existingChat = yield this._chatRepository.findChatByParticipants(customer._id.toString(), vendor._id.toString(), service._id.toString());
                    if (!existingChat) {
                        yield this._chatRepository.createChat({
                            chatId: (0, uuid_1.v4)(),
                            customerRef: customer._id.toString(),
                            vendorRef: vendor._id.toString(),
                            serviceRef: service._id.toString(),
                            unreadCount: {
                                customer: 0,
                                vendor: 0,
                            },
                            isActive: true,
                            lastMessage: undefined,
                        });
                    }
                }
            }
        });
    }
};
exports.StripePaymentSucceededUseCase = StripePaymentSucceededUseCase;
exports.StripePaymentSucceededUseCase = StripePaymentSucceededUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IBookingHoldRepository')),
    __param(1, (0, tsyringe_1.inject)('IBookingRepository')),
    __param(2, (0, tsyringe_1.inject)('IRedisSlotLockRepository')),
    __param(3, (0, tsyringe_1.inject)('IPaymentRepository')),
    __param(4, (0, tsyringe_1.inject)('IWalletTransactionRepository')),
    __param(5, (0, tsyringe_1.inject)('IWalletRepository')),
    __param(6, (0, tsyringe_1.inject)('ICreateNotificationUseCase')),
    __param(7, (0, tsyringe_1.inject)('ICustomerRepository')),
    __param(8, (0, tsyringe_1.inject)('IVendorRepository')),
    __param(9, (0, tsyringe_1.inject)('IChatRepository')),
    __param(10, (0, tsyringe_1.inject)('IServiceRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object])
], StripePaymentSucceededUseCase);
