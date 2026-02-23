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
exports.CreateBookingHoldUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const crypto_1 = require("crypto");
const custom_error_1 = require("../../../domain/utils/custom.error");
const create_booking_hold_mapper_1 = require("../../mappers/booking_hold/create_booking_hold_mapper");
let CreateBookingHoldUseCase = class CreateBookingHoldUseCase {
    constructor(_bookingHoldRepository, _redisSlotLockRepository, _serviceRepository, _customerRepository) {
        this._bookingHoldRepository = _bookingHoldRepository;
        this._redisSlotLockRepository = _redisSlotLockRepository;
        this._serviceRepository = _serviceRepository;
        this._customerRepository = _customerRepository;
    }
    execute(validatedDTO, customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { serviceId, slots, paymentMethod, addressId } = validatedDTO;
            if (!slots.length) {
                throw new custom_error_1.CustomError('At least one slot is required', 400);
            }
            const service = yield this._serviceRepository.findOne({ serviceId });
            if (!service) {
                throw new custom_error_1.CustomError('Service not found', 404);
            }
            if (!service.isActiveStatusByAdmin || !service.isActiveStatusByVendor) {
                throw new custom_error_1.CustomError('Service is not active', 400);
            }
            const customer = yield this._customerRepository.findOne({
                userId: customerId,
            });
            if (!customer || !customer._id) {
                throw new custom_error_1.CustomError('Customer not found', 404);
            }
            if (!customer.status) {
                throw new custom_error_1.CustomError('Customer is blocked', 403);
            }
            const lockedSlots = [];
            try {
                for (const slot of slots) {
                    const locked = yield this._redisSlotLockRepository.lockSlot(serviceId, slot.date, slot.start);
                    if (!locked) {
                        throw new custom_error_1.CustomError(`Slot ${slot.date} ${slot.start} is on hold`, 409);
                    }
                    lockedSlots.push({ date: slot.date, start: slot.start });
                }
                const totalAmount = slots.reduce((s, x) => s + x.pricePerSlot, 0);
                const advanceAmount = slots.reduce((s, x) => s + x.advancePerSlot, 0);
                const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
                const bookingHold = yield this._bookingHoldRepository.save({
                    holdId: `BKGRP_${(0, crypto_1.randomUUID)()}`,
                    serviceRef: service._id,
                    vendorRef: service.vendorRef,
                    customerRef: customer._id.toString(),
                    addressId,
                    slots,
                    pricing: {
                        totalAmount,
                        advanceAmount,
                        remainingAmount: totalAmount - advanceAmount,
                    },
                    paymentMethod,
                    status: 'active',
                    expiresAt,
                });
                return create_booking_hold_mapper_1.CreateBookingHoldResponseMapper.toDTO(bookingHold);
            }
            catch (error) {
                yield this._redisSlotLockRepository.releaseMultipleSlots(serviceId, lockedSlots);
                throw error;
            }
        });
    }
};
exports.CreateBookingHoldUseCase = CreateBookingHoldUseCase;
exports.CreateBookingHoldUseCase = CreateBookingHoldUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IBookingHoldRepository')),
    __param(1, (0, tsyringe_1.inject)('IRedisSlotLockRepository')),
    __param(2, (0, tsyringe_1.inject)('IServiceRepository')),
    __param(3, (0, tsyringe_1.inject)('ICustomerRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], CreateBookingHoldUseCase);
