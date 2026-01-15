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
exports.BookingController = void 0;
const tsyringe_1 = require("tsyringe");
require("reflect-metadata");
const constants_1 = require("../../../shared/constants");
const error_handler_1 = require("../../../shared/utils/error_handler");
const get_available_slots_for_customer_schema_1 = require("../../validations/booking/get_available_slots_for_customer_schema");
const get_available_slots_for_customer_mapper_1 = require("../../../application/mappers/booking/get_available_slots_for_customer_mapper");
const create_booking_hold_schema_1 = require("../../validations/booking_hold/create_booking_hold_schema");
const create_booking_hold_mapper_1 = require("../../../application/mappers/booking_hold/create_booking_hold_mapper");
const create_stripe_payment_intent_schema_1 = require("../../validations/booking_hold/create_stripe_payment_intent_schema");
const get_bookings_schema_1 = require("../../validations/booking/get_bookings_schema");
const custom_error_1 = require("../../../domain/utils/custom.error");
let BookingController = class BookingController {
    constructor(_getAvailableSlotsForCustomerUseCase, _createBookingHoldUseCase, _createStripePaymentIntentUseCase, _getBookingsUseCase, _cancelBookingUseCase, _getBookingDetailsUseCase, _getBookingByPaymentIdUseCase, _payBalanceUseCase) {
        this._getAvailableSlotsForCustomerUseCase = _getAvailableSlotsForCustomerUseCase;
        this._createBookingHoldUseCase = _createBookingHoldUseCase;
        this._createStripePaymentIntentUseCase = _createStripePaymentIntentUseCase;
        this._getBookingsUseCase = _getBookingsUseCase;
        this._cancelBookingUseCase = _cancelBookingUseCase;
        this._getBookingDetailsUseCase = _getBookingDetailsUseCase;
        this._getBookingByPaymentIdUseCase = _getBookingByPaymentIdUseCase;
        this._payBalanceUseCase = _payBalanceUseCase;
    }
    getAvailableSlotsForCustomer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const basic = get_available_slots_for_customer_schema_1.GetAvailableSlotsForCustomerBasicSchema.parse(req.query);
                const dto = get_available_slots_for_customer_mapper_1.RequestGetAvailableSlotsForCustomerRequestMapper.toDTO(basic);
                const validatedDTO = get_available_slots_for_customer_schema_1.GetAvailableSlotsForCustomerRequestSchema.parse(dto);
                const response = yield this._getAvailableSlotsForCustomerUseCase.execute(validatedDTO);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.SLOTS_FETCHED,
                    data: response,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    createBookingHold(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const basic = create_booking_hold_schema_1.CreateBookingHoldBasicSchema.parse(req.body);
                const dto = create_booking_hold_mapper_1.CreateBookingHoldRequestMapper.toDTO(basic);
                const validatedDTO = create_booking_hold_schema_1.CreateBookingHoldRequestSchema.parse(dto);
                const customerId = req.user.userId;
                const response = yield this._createBookingHoldUseCase.execute(validatedDTO, customerId);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.BOOKING_HOLD_CREATED,
                    data: response,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    createPaymentIntent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { holdId } = req.params;
                const validatedDTO = create_stripe_payment_intent_schema_1.createStripePaymentIntentSchema.parse(holdId);
                const response = yield this._createStripePaymentIntentUseCase.execute(validatedDTO);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: 'Payment intent created',
                    data: response,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    payBalance(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookingId } = req.params;
                const checkoutUrl = yield this._payBalanceUseCase.execute(bookingId);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: 'Balance payment session created',
                    checkoutUrl
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    getMyBookings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.userId;
                const role = req.user.role;
                const dto = Object.assign(Object.assign({}, req.query), { userId,
                    role });
                const validatedDTO = get_bookings_schema_1.getMyBookingsRequestSchema.parse(dto);
                const bookings = yield this._getBookingsUseCase.execute(validatedDTO);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    data: bookings,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    cancelBooking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingId = req.params.bookingId;
                const { reason } = req.body;
                const userId = req.user.userId;
                const role = req.user.role;
                if (!reason || typeof reason !== 'string' || !reason.trim()) {
                    throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.CANCELLATION_REASON_NEEDED, constants_1.HTTP_STATUS.BAD_REQUEST);
                }
                yield this._cancelBookingUseCase.execute({
                    bookingId,
                    userId,
                    role,
                    reason: reason.trim(),
                });
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.CANCELLED_BOOKING_SUCCESSFULLY,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    getBookingDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingId = req.params.bookingId;
                const userId = req.user.userId;
                const role = req.user.role;
                const data = yield this._getBookingDetailsUseCase.execute({
                    bookingId,
                    userId,
                    role,
                });
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.FOUND_BOOKING_DETAILS,
                    data,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    getBookingByPaymentId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { paymentId } = req.params;
                const userId = req.user.userId;
                const role = req.user.role;
                const booking = yield this._getBookingByPaymentIdUseCase.execute(paymentId);
                if (!booking) {
                    throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.NO_BOOKING_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
                }
                // Reuse the getBookingDetails usecase logic to get full details
                const data = yield this._getBookingDetailsUseCase.execute({
                    bookingId: booking.bookingId,
                    userId,
                    role,
                });
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.FOUND_BOOKING_DETAILS,
                    data,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
};
exports.BookingController = BookingController;
exports.BookingController = BookingController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IGetAvailableSlotsForCustomerUseCase')),
    __param(1, (0, tsyringe_1.inject)('ICreateBookingHoldUseCase')),
    __param(2, (0, tsyringe_1.inject)('ICreateStripePaymentIntentUseCase')),
    __param(3, (0, tsyringe_1.inject)('IGetBookingsUseCase')),
    __param(4, (0, tsyringe_1.inject)('ICancelBookingUseCase')),
    __param(5, (0, tsyringe_1.inject)('IGetBookingDetailsUseCase')),
    __param(6, (0, tsyringe_1.inject)('IGetBookingByPaymentIdUseCase')),
    __param(7, (0, tsyringe_1.inject)('IPayBalanceUseCase')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object])
], BookingController);
