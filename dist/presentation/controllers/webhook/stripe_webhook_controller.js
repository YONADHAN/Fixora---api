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
exports.StripeWebhookController = void 0;
const stripe_1 = __importDefault(require("stripe"));
const tsyringe_1 = require("tsyringe");
const config_1 = require("../../../shared/config");
const error_handler_1 = require("../../../shared/utils/error_handler");
const stripe = new stripe_1.default(config_1.config.stripe.STRIPE_SECRET_KEY);
let StripeWebhookController = class StripeWebhookController {
    constructor(_paymentSucceededUseCase, _paymentFailedUseCase) {
        this._paymentSucceededUseCase = _paymentSucceededUseCase;
        this._paymentFailedUseCase = _paymentFailedUseCase;
    }
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sig = req.headers['stripe-signature'];
                if (!sig) {
                    res.status(400).send('Missing stripe signature');
                    return;
                }
                let event;
                try {
                    event = stripe.webhooks.constructEvent(req.body, sig, config_1.config.stripe.STRIPE_WEBHOOK_SECRET);
                }
                catch (err) {
                    res.status(400).send('Webhook signature verification failed');
                    return;
                }
                switch (event.type) {
                    case 'payment_intent.succeeded':
                        yield this._paymentSucceededUseCase.execute(event.data.object);
                        break;
                    case 'payment_intent.payment_failed':
                        yield this._paymentFailedUseCase.execute(event.data.object);
                        break;
                    default:
                        break;
                }
                res.json({ received: true });
            }
            catch (error) {
                console.error('Stripe webhook error:', error);
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
};
exports.StripeWebhookController = StripeWebhookController;
exports.StripeWebhookController = StripeWebhookController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IStripePaymentSucceedUseCase')),
    __param(1, (0, tsyringe_1.inject)('IStripePaymentFailedUseCase')),
    __metadata("design:paramtypes", [Object, Object])
], StripeWebhookController);
