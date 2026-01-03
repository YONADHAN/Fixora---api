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
exports.BookingRepository = void 0;
const tsyringe_1 = require("tsyringe");
const mongoose_1 = require("mongoose");
const base_repository_1 = require("../../base_repository");
const booking_model_1 = require("../../../database/mongoDb/models/booking_model");
const custom_error_1 = require("../../../../domain/utils/custom.error");
let BookingRepository = class BookingRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(booking_model_1.BookingModel);
    }
    validateObjectId(id, fieldName) {
        if (id && !mongoose_1.Types.ObjectId.isValid(id)) {
            throw new custom_error_1.CustomError(`Invalid ${fieldName}`, 400);
        }
    }
    toModel(entity) {
        var _a;
        this.validateObjectId(entity.serviceRef, 'serviceRef');
        this.validateObjectId(entity.vendorRef, 'vendorRef');
        this.validateObjectId(entity.customerRef, 'customerRef');
        this.validateObjectId(entity.paymentRef, 'paymentRef');
        this.validateObjectId((_a = entity.cancelInfo) === null || _a === void 0 ? void 0 : _a.cancelledByRef, 'cancelledByRef');
        return {
            bookingId: entity.bookingId,
            bookingGroupId: entity.bookingGroupId,
            serviceRef: entity.serviceRef
                ? new mongoose_1.Types.ObjectId(entity.serviceRef)
                : undefined,
            vendorRef: entity.vendorRef
                ? new mongoose_1.Types.ObjectId(entity.vendorRef)
                : undefined,
            customerRef: entity.customerRef
                ? new mongoose_1.Types.ObjectId(entity.customerRef)
                : undefined,
            date: entity.date,
            slotStart: entity.slotStart,
            slotEnd: entity.slotEnd,
            paymentRef: entity.paymentRef
                ? new mongoose_1.Types.ObjectId(entity.paymentRef)
                : undefined,
            paymentStatus: entity.paymentStatus,
            serviceStatus: entity.serviceStatus,
            cancelInfo: entity.cancelInfo
                ? {
                    cancelledByRole: entity.cancelInfo.cancelledByRole,
                    cancelledByRef: entity.cancelInfo.cancelledByRef
                        ? new mongoose_1.Types.ObjectId(entity.cancelInfo.cancelledByRef)
                        : undefined,
                    reason: entity.cancelInfo.reason,
                    cancelledAt: entity.cancelInfo.cancelledAt,
                }
                : undefined,
        };
    }
    toEntity(model) {
        var _a, _b;
        return {
            _id: model._id.toString(),
            bookingId: model.bookingId,
            bookingGroupId: model.bookingGroupId,
            serviceRef: model.serviceRef.toString(),
            vendorRef: model.vendorRef.toString(),
            customerRef: model.customerRef.toString(),
            date: model.date,
            slotStart: model.slotStart,
            slotEnd: model.slotEnd,
            paymentRef: (_a = model.paymentRef) === null || _a === void 0 ? void 0 : _a.toString(),
            paymentStatus: model.paymentStatus,
            serviceStatus: model.serviceStatus,
            cancelInfo: model.cancelInfo
                ? {
                    cancelledByRole: model.cancelInfo.cancelledByRole,
                    cancelledByRef: (_b = model.cancelInfo.cancelledByRef) === null || _b === void 0 ? void 0 : _b.toString(),
                    reason: model.cancelInfo.reason,
                    cancelledAt: model.cancelInfo.cancelledAt,
                }
                : undefined,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
        };
    }
    getBookingById(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mongoose_1.Types.ObjectId.isValid(bookingId)) {
                const booking = yield this.model
                    .findById(bookingId)
                    .lean();
                if (booking)
                    return this.toEntity(booking);
            }
            // Fallback: search by custom bookingId field if applicable, or return null
            // Assuming strict ObjectId check for now, but if bookingId can be a custom string ID:
            const bookingByCustomId = yield this.model
                .findOne({ bookingId: bookingId })
                .lean();
            return bookingByCustomId ? this.toEntity(bookingByCustomId) : null;
        });
    }
    findConfirmedBookedSlotsForService(serviceRef, month, year) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validateObjectId(serviceRef, 'serviceRef');
            if (month < 0 || month > 11) {
                throw new Error(`Invalid month: ${month}. Must be between 0-11`);
            }
            if (year < 2000 || year > 2100) {
                throw new Error(`Invalid year: ${year}`);
            }
            const startOfMonth = new Date(year, month, 1);
            const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);
            const bookings = yield this.model
                .find({
                serviceRef: new mongoose_1.Types.ObjectId(serviceRef),
                serviceStatus: { $ne: 'cancelled' },
                paymentStatus: { $in: ['advance-paid', 'paid'] },
                slotStart: { $gte: startOfMonth },
                slotEnd: { $lte: endOfMonth },
            })
                .lean();
            return bookings.map((b) => this.toEntity(b));
        });
    }
    findBookingsForUser(page_1, limit_1) {
        return __awaiter(this, arguments, void 0, function* (page, limit, search = '', filters = {}) {
            const skip = (page - 1) * limit;
            const filter = Object.assign(Object.assign({}, filters), (search
                ? {
                    $or: [
                        { bookingId: { $regex: search, $options: 'i' } },
                        { bookingGroupId: { $regex: search, $options: 'i' } },
                        { paymentStatus: { $regex: search, $options: 'i' } },
                        { serviceStatus: { $regex: search, $options: 'i' } },
                    ],
                }
                : {}));
            const [documents, totalCount] = yield Promise.all([
                this.model
                    .find(filter)
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 })
                    .lean(),
                this.model.countDocuments(filter),
            ]);
            return {
                data: documents.map((doc) => this.toEntity(doc)),
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
            };
        });
    }
};
exports.BookingRepository = BookingRepository;
exports.BookingRepository = BookingRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], BookingRepository);
