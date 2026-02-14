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
exports.GetBookingDetailsForVendorStrategy = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../../../domain/utils/custom.error");
const constants_1 = require("../../../../shared/constants");
const get_booking_details_strategy_mapper_1 = require("../../../mappers/booking/get_booking_details_strategy_mapper");
let GetBookingDetailsForVendorStrategy = class GetBookingDetailsForVendorStrategy {
    constructor(_vendorRepository, _bookingRepository, _serviceRepository, _customerRepository, _addressRepository) {
        this._vendorRepository = _vendorRepository;
        this._bookingRepository = _bookingRepository;
        this._serviceRepository = _serviceRepository;
        this._customerRepository = _customerRepository;
        this._addressRepository = _addressRepository;
    }
    execute(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { bookingId, userId } = payload;
            const vendor = yield this._vendorRepository.findOne({ userId });
            if (!vendor) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.USERS_NOT_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
            }
            const booking = yield this._bookingRepository.findOne({ bookingId });
            if (!booking) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.NO_BOOKING_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
            }
            if (booking.vendorRef !== ((_a = vendor._id) === null || _a === void 0 ? void 0 : _a.toString())) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.UNAUTHORIZED_ACCESS, constants_1.HTTP_STATUS.FORBIDDEN);
            }
            const service = yield this._serviceRepository.findOne({
                _id: booking.serviceRef,
            });
            if (!service) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.SERVICES_NOT_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
            }
            const customer = yield this._customerRepository.findOne({
                _id: booking.customerRef,
            });
            if (!customer) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.USER_NOT_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
            }
            let address = null;
            if (booking.addressId) {
                address = yield this._addressRepository.findOne({
                    addressId: booking.addressId,
                });
            }
            return get_booking_details_strategy_mapper_1.GetBookingDetailsForVendorResponseMapper.toDTO(booking, service, customer, address);
        });
    }
};
exports.GetBookingDetailsForVendorStrategy = GetBookingDetailsForVendorStrategy;
exports.GetBookingDetailsForVendorStrategy = GetBookingDetailsForVendorStrategy = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IVendorRepository')),
    __param(1, (0, tsyringe_1.inject)('IBookingRepository')),
    __param(2, (0, tsyringe_1.inject)('IServiceRepository')),
    __param(3, (0, tsyringe_1.inject)('ICustomerRepository')),
    __param(4, (0, tsyringe_1.inject)('IAddressRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], GetBookingDetailsForVendorStrategy);
