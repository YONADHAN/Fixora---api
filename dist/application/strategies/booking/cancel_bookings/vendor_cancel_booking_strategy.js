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
exports.VendorCancelBookingStrategy = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../../../domain/utils/custom.error");
const constants_1 = require("../../../../shared/constants");
let VendorCancelBookingStrategy = class VendorCancelBookingStrategy {
    constructor(_vendorRepository, _bookingRepository) {
        this._vendorRepository = _vendorRepository;
        this._bookingRepository = _bookingRepository;
    }
    execute(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { userId, bookingId, reason, role } = payload;
            const booking = yield this._bookingRepository.findOne({ bookingId });
            if (!booking) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.NO_BOOKING_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
            }
            const user = yield this._vendorRepository.findOne({ userId });
            if (!(user && user._id)) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.FILE_NOT_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
            }
            if (booking.vendorRef !== user._id.toString()) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.CONFLICTING_INPUTS, constants_1.HTTP_STATUS.CONFLICT);
            }
            (_a = booking.cancelInfo) === null || _a === void 0 ? void 0 : _a.cancelledByRef;
            //refund payment initiation stripe
            //payment schema updation
            //wallet transaction updation
            //booking schema updation
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
exports.VendorCancelBookingStrategy = VendorCancelBookingStrategy;
exports.VendorCancelBookingStrategy = VendorCancelBookingStrategy = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IVendorRepository')),
    __param(1, (0, tsyringe_1.inject)('IBookingRepository')),
    __metadata("design:paramtypes", [Object, Object])
], VendorCancelBookingStrategy);
