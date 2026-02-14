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
exports.PaymentRepository = void 0;
const tsyringe_1 = require("tsyringe");
const mongoose_1 = require("mongoose");
const base_repository_1 = require("../../base_repository");
const payment_model_1 = require("../../../database/mongoDb/models/payment_model");
require("../../../database/mongoDb/models/service_model");
let PaymentRepository = class PaymentRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(payment_model_1.PaymentModel);
    }
    toModel(entity) {
        var _a;
        return {
            paymentId: entity.paymentId,
            bookingGroupId: entity.bookingGroupId,
            customerRef: entity.customerRef
                ? new mongoose_1.Types.ObjectId(entity.customerRef)
                : undefined,
            vendorRef: entity.vendorRef
                ? new mongoose_1.Types.ObjectId(entity.vendorRef)
                : undefined,
            serviceRef: entity.serviceRef
                ? new mongoose_1.Types.ObjectId(entity.serviceRef)
                : undefined,
            advancePayment: entity.advancePayment && {
                stripePaymentIntentId: entity.advancePayment.stripePaymentIntentId,
                amount: entity.advancePayment.amount,
                currency: entity.advancePayment.currency,
                status: entity.advancePayment.status,
                paidAt: entity.advancePayment.paidAt,
                failures: entity.advancePayment.failures.map((f) => ({
                    code: f.code,
                    message: f.message,
                    type: f.type,
                    stripeEventId: f.stripeEventId,
                    occurredAt: f.occurredAt,
                })),
            },
            slots: (_a = entity.slots) === null || _a === void 0 ? void 0 : _a.map((slot) => ({
                bookingId: slot.bookingId,
                pricing: {
                    totalPrice: slot.pricing.totalPrice,
                    advanceAmount: slot.pricing.advanceAmount,
                    remainingAmount: slot.pricing.remainingAmount,
                },
                advanceRefund: slot.advanceRefund && {
                    refundId: slot.advanceRefund.refundId,
                    amount: slot.advanceRefund.amount,
                    status: slot.advanceRefund.status,
                    initiatedBy: slot.advanceRefund.initiatedBy,
                    initiatedByUserId: new mongoose_1.Types.ObjectId(slot.advanceRefund.initiatedByUserId),
                    createdAt: slot.advanceRefund.createdAt,
                    failures: slot.advanceRefund.failures.map((f) => ({
                        code: f.code,
                        message: f.message,
                        stripeEventId: f.stripeEventId,
                        occurredAt: f.occurredAt,
                    })),
                },
                remainingPayment: slot.remainingPayment && {
                    stripePaymentIntentId: slot.remainingPayment.stripePaymentIntentId,
                    amount: slot.remainingPayment.amount,
                    status: slot.remainingPayment.status,
                    paidAt: slot.remainingPayment.paidAt,
                    failures: slot.remainingPayment.failures.map((f) => ({
                        code: f.code,
                        message: f.message,
                        type: f.type,
                        stripeEventId: f.stripeEventId,
                        occurredAt: f.occurredAt,
                    })),
                },
                status: slot.status,
            })),
            status: entity.status,
        };
    }
    toEntity(model) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return {
            _id: model._id.toString(),
            paymentId: model.paymentId,
            bookingGroupId: model.bookingGroupId,
            customerRef: (_a = model.customerRef) === null || _a === void 0 ? void 0 : _a.toString(),
            vendorRef: (_b = model.vendorRef) === null || _b === void 0 ? void 0 : _b.toString(),
            serviceRef: (_c = model.serviceRef) === null || _c === void 0 ? void 0 : _c.toString(),
            advancePayment: {
                stripePaymentIntentId: ((_d = model.advancePayment) === null || _d === void 0 ? void 0 : _d.stripePaymentIntentId) || '',
                amount: ((_e = model.advancePayment) === null || _e === void 0 ? void 0 : _e.amount) || 0,
                currency: ((_f = model.advancePayment) === null || _f === void 0 ? void 0 : _f.currency) || 'INR',
                status: ((_g = model.advancePayment) === null || _g === void 0 ? void 0 : _g.status) || 'pending',
                paidAt: (_h = model.advancePayment) === null || _h === void 0 ? void 0 : _h.paidAt,
                failures: (((_j = model.advancePayment) === null || _j === void 0 ? void 0 : _j.failures) || []).map((f) => {
                    var _a;
                    return ({
                        code: f.code,
                        message: f.message,
                        type: (_a = f.type) !== null && _a !== void 0 ? _a : 'api_error',
                        stripeEventId: f.stripeEventId,
                        occurredAt: f.occurredAt,
                    });
                }),
            },
            slots: (model.slots || []).map((slot) => {
                var _a, _b, _c, _d;
                return ({
                    bookingId: slot.bookingId,
                    pricing: {
                        totalPrice: ((_a = slot.pricing) === null || _a === void 0 ? void 0 : _a.totalPrice) || 0,
                        advanceAmount: ((_b = slot.pricing) === null || _b === void 0 ? void 0 : _b.advanceAmount) || 0,
                        remainingAmount: ((_c = slot.pricing) === null || _c === void 0 ? void 0 : _c.remainingAmount) || 0,
                    },
                    advanceRefund: slot.advanceRefund
                        ? {
                            refundId: slot.advanceRefund.refundId,
                            amount: slot.advanceRefund.amount,
                            status: slot.advanceRefund.status,
                            initiatedBy: slot.advanceRefund.initiatedBy,
                            initiatedByUserId: (_d = slot.advanceRefund.initiatedByUserId) === null || _d === void 0 ? void 0 : _d.toString(),
                            createdAt: slot.advanceRefund.createdAt,
                            failures: (slot.advanceRefund.failures || []).map((f) => ({
                                code: f.code,
                                message: f.message,
                                stripeEventId: f.stripeEventId,
                                occurredAt: f.occurredAt,
                            })),
                        }
                        : undefined,
                    remainingPayment: slot.remainingPayment
                        ? {
                            stripePaymentIntentId: slot.remainingPayment.stripePaymentIntentId,
                            amount: slot.remainingPayment.amount,
                            status: slot.remainingPayment.status,
                            paidAt: slot.remainingPayment.paidAt,
                            failures: (slot.remainingPayment.failures || []).map((f) => {
                                var _a;
                                return ({
                                    code: f.code,
                                    message: f.message,
                                    type: (_a = f.type) !== null && _a !== void 0 ? _a : 'api_error',
                                    stripeEventId: f.stripeEventId,
                                    occurredAt: f.occurredAt,
                                });
                            }),
                        }
                        : undefined,
                    status: slot.status,
                });
            }),
            status: model.status,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
        };
    }
    updateSlotAdvanceRefund(paymentId, bookingId, refund) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.updateOne({
                paymentId,
                'slots.bookingId': bookingId,
            }, {
                $set: {
                    'slots.$.advanceRefund': {
                        refundId: refund.refundId,
                        amount: refund.amount,
                        status: refund.status,
                        initiatedBy: refund.initiatedBy,
                        initiatedByUserId: new mongoose_1.Types.ObjectId(refund.initiatedByUserId),
                        createdAt: refund.createdAt,
                        failures: refund.failures,
                    },
                    'slots.$.status': 'refunded',
                },
            });
        });
    }
    updateRemainingPaymentByBookingId(bookingId, remainingPayment) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.updateOne({ 'slots.bookingId': bookingId }, {
                $set: {
                    'slots.$.remainingPayment': remainingPayment,
                    'slots.$.status': 'fully-paid',
                    status: 'fully-paid',
                },
            });
        });
    }
    updateRemainingPaymentByBookingGroupId(bookingGroupId, remainingPayment) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.updateOne({ bookingGroupId }, {
                $set: {
                    'slots.$[].remainingPayment': remainingPayment,
                    'slots.$[].status': 'fully-paid',
                    status: 'fully-paid',
                },
            });
        });
    }
    findAllPayments(page, limit, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const totalCount = yield this.model.countDocuments(filter);
            const data = yield this.model
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('serviceRef', 'name')
                .populate('vendorRef', 'name')
                .populate('customerRef', 'name')
                .lean();
            return {
                data: data.map((d) => {
                    var _a, _b, _c;
                    return (Object.assign(Object.assign({}, this.toEntity(d)), { serviceName: (_a = d.serviceRef) === null || _a === void 0 ? void 0 : _a.name, vendorName: (_b = d.vendorRef) === null || _b === void 0 ? void 0 : _b.name, customerName: (_c = d.customerRef) === null || _c === void 0 ? void 0 : _c.name }));
                }),
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
            };
        });
    }
};
exports.PaymentRepository = PaymentRepository;
exports.PaymentRepository = PaymentRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], PaymentRepository);
