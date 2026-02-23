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
exports.GetBookingForVendorStrategy = void 0;
const tsyringe_1 = require("tsyringe");
const constants_1 = require("../../../../shared/constants");
const custom_error_1 = require("../../../../domain/utils/custom.error");
const get_bookings_strategy_mapper_1 = require("../../../mappers/booking/get_bookings_strategy_mapper");
let GetBookingForVendorStrategy = class GetBookingForVendorStrategy {
    constructor(_bookingRepository, _vendorRepository) {
        this._bookingRepository = _bookingRepository;
        this._vendorRepository = _vendorRepository;
    }
    strategy(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, search = '', userId } = dto;
            const vendor = yield this._vendorRepository.findOne({ userId });
            if (!vendor) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.USER_NOT_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
            }
            const booking = yield this._bookingRepository.findBookingsForUser(page, limit, search, { vendorRef: vendor._id });
            return get_bookings_strategy_mapper_1.GetBookingResponseMapper.toDTO(booking);
        });
    }
};
exports.GetBookingForVendorStrategy = GetBookingForVendorStrategy;
exports.GetBookingForVendorStrategy = GetBookingForVendorStrategy = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IBookingRepository')),
    __param(1, (0, tsyringe_1.inject)('IVendorRepository')),
    __metadata("design:paramtypes", [Object, Object])
], GetBookingForVendorStrategy);
