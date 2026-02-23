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
exports.CheckReviewEligibilityUseCase = void 0;
const tsyringe_1 = require("tsyringe");
let CheckReviewEligibilityUseCase = class CheckReviewEligibilityUseCase {
    constructor(bookingRepository, reviewRepository) {
        this.bookingRepository = bookingRepository;
        this.reviewRepository = reviewRepository;
    }
    execute(customerId, serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Find a COMPLETED booking for this customer and service
            const { data: bookings } = yield this.bookingRepository.findBookingsForUser(1, 100, '', {
                customerRef: customerId,
                serviceRef: serviceId,
                status: 'COMPLETED',
            });
            if (!bookings || bookings.length === 0) {
                return {
                    canReview: false,
                    message: 'Only customers who completed this service can review.',
                };
            }
            // 2. Check each completed booking to see if it already has a review
            for (const booking of bookings) {
                const existingReview = yield this.reviewRepository.findByBookingId(booking.bookingId);
                if (!existingReview) {
                    return { canReview: true, bookingId: booking.bookingId };
                }
            }
            return {
                canReview: false,
                message: 'You have already reviewed all your completed bookings for this service.',
            };
        });
    }
};
exports.CheckReviewEligibilityUseCase = CheckReviewEligibilityUseCase;
exports.CheckReviewEligibilityUseCase = CheckReviewEligibilityUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IBookingRepository')),
    __param(1, (0, tsyringe_1.inject)('IReviewRepository')),
    __metadata("design:paramtypes", [Object, Object])
], CheckReviewEligibilityUseCase);
