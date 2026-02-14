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
exports.CreateStripePaymentIntentUseCase = exports.stripe = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../../domain/utils/custom.error");
const stripe_1 = __importDefault(require("stripe"));
const config_1 = require("../../../shared/config");
exports.stripe = new stripe_1.default(config_1.config.stripe.STRIPE_SECRET_KEY);
let CreateStripePaymentIntentUseCase = class CreateStripePaymentIntentUseCase {
    constructor(bookingHoldRepository) {
        this.bookingHoldRepository = bookingHoldRepository;
    }
    execute(validatedDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            const holdId = validatedDTO;
            const hold = yield this.bookingHoldRepository.findActiveHoldById(holdId);
            if (!hold) {
                throw new custom_error_1.CustomError('Booking hold not found or expired', 404);
            }
            if (hold.expiresAt < new Date()) {
                throw new custom_error_1.CustomError('Booking hold expired', 410);
            }
            if (hold.stripePaymentIntentId) {
                const existingIntent = yield exports.stripe.paymentIntents.retrieve(hold.stripePaymentIntentId);
                return {
                    clientSecret: existingIntent.client_secret,
                };
            }
            const paymentIntent = yield exports.stripe.paymentIntents.create({
                amount: hold.pricing.advanceAmount * 100,
                currency: 'inr',
                automatic_payment_methods: { enabled: true },
                metadata: {
                    holdId: hold.holdId,
                    serviceRef: hold.serviceRef,
                    customerRef: hold.customerRef,
                },
            });
            console.log('current payment internt id for holding', paymentIntent.id);
            yield this.bookingHoldRepository.update({ holdId }, { stripePaymentIntentId: paymentIntent.id });
            return {
                clientSecret: paymentIntent.client_secret,
            };
        });
    }
};
exports.CreateStripePaymentIntentUseCase = CreateStripePaymentIntentUseCase;
exports.CreateStripePaymentIntentUseCase = CreateStripePaymentIntentUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IBookingHoldRepository')),
    __metadata("design:paramtypes", [Object])
], CreateStripePaymentIntentUseCase);
