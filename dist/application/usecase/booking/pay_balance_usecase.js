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
exports.PayBalanceUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const stripe_1 = __importDefault(require("stripe"));
const config_1 = require("../../../shared/config");
const custom_error_1 = require("../../../domain/utils/custom.error");
const constants_1 = require("../../../shared/constants");
const stripe = new stripe_1.default(config_1.config.stripe.STRIPE_SECRET_KEY);
let PayBalanceUseCase = class PayBalanceUseCase {
    constructor(_paymentRepository) {
        this._paymentRepository = _paymentRepository;
    }
    execute(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Find payment using bookingId
            const payment = yield this._paymentRepository.findOne({
                'slots.bookingId': bookingId,
            });
            if (!payment) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.NO_BOOKING_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
            }
            const bookingGroupId = payment.bookingGroupId;
            // 2. Calculate total remaining across all slots in this group
            const remainingAmount = payment.slots.reduce((sum, slot) => {
                if (slot.status === 'advance-paid') {
                    return sum + slot.pricing.remainingAmount;
                }
                return sum;
            }, 0);
            if (remainingAmount <= 0) {
                throw new custom_error_1.CustomError('No remaining balance to pay', constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            // 3. Create Stripe Checkout Session
            const session = yield stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'inr',
                            product_data: {
                                name: `Balance Payment for Booking Group ${bookingGroupId}`,
                            },
                            unit_amount: Math.round(remainingAmount * 100),
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `${config_1.config.cors.FRONTEND_URL}/customer/booking/success?groupId=${bookingGroupId}`,
                cancel_url: `${config_1.config.cors.FRONTEND_URL}/customer/booking/${bookingId}`,
                payment_intent_data: {
                    metadata: {
                        bookingGroupId,
                        paymentType: 'balance',
                    },
                },
            });
            if (!session.url) {
                throw new custom_error_1.CustomError('Failed to create Stripe Checkout Session', constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }
            return session.url;
        });
    }
};
exports.PayBalanceUseCase = PayBalanceUseCase;
exports.PayBalanceUseCase = PayBalanceUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IPaymentRepository')),
    __metadata("design:paramtypes", [Object])
], PayBalanceUseCase);
