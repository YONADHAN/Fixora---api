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
exports.ReviewRepository = void 0;
const tsyringe_1 = require("tsyringe");
const base_repository_1 = require("../../base_repository");
const review_schema_1 = require("../../../database/mongoDb/schemas/review_schema");
const mongoose_1 = require("mongoose");
let ReviewRepository = class ReviewRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(review_schema_1.ReviewModel);
    }
    toEntity(model) {
        return {
            _id: model._id.toString(),
            reviewId: model.reviewId,
            bookingId: model.bookingId,
            serviceId: model.serviceId.toString(),
            customerId: model.customerId, // Already string (UUID)
            vendorId: model.vendorId, // Already string (UUID)
            rating: model.rating,
            comment: model.comment,
            createdAt: model.createdAt,
            isDeleted: model.isDeleted,
        };
    }
    toModel(entity) {
        return {
            reviewId: entity.reviewId,
            bookingId: entity.bookingId,
            serviceId: entity.serviceId ? new mongoose_1.Types.ObjectId(entity.serviceId) : undefined,
            customerId: entity.customerId,
            vendorId: entity.vendorId,
            rating: entity.rating,
            comment: entity.comment,
            isDeleted: entity.isDeleted,
        };
    }
    create(review) {
        return __awaiter(this, void 0, void 0, function* () {
            const created = yield this.model.create(this.toModel(review));
            return this.toEntity(created);
        });
    }
    findByServiceId(serviceId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const query = { serviceId: new mongoose_1.Types.ObjectId(serviceId), isDeleted: false };
            const [reviews, total] = yield Promise.all([
                this.model.find(query)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .populate('customerId', 'name profileImage') // Populate customer details
                    .lean(),
                this.model.countDocuments(query),
            ]);
            // Add populated fields manually if needed or extend entity
            // For now, returning basic entities mapped from DB
            const mappedReviews = reviews.map((r) => {
                var _a, _b;
                return (Object.assign(Object.assign({}, this.toEntity(r)), { customerName: (_a = r.customerId) === null || _a === void 0 ? void 0 : _a.name, customerImage: (_b = r.customerId) === null || _b === void 0 ? void 0 : _b.profileImage }));
            });
            return { reviews: mappedReviews, total };
        });
    }
    findByBookingId(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const review = yield this.model.findOne({ bookingId }).lean();
            return review ? this.toEntity(review) : null;
        });
    }
    calculateAverage(serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const stats = yield this.model.aggregate([
                { $match: { serviceId: new mongoose_1.Types.ObjectId(serviceId), isDeleted: false } },
                {
                    $group: {
                        _id: '$serviceId',
                        avgRating: { $avg: '$rating' },
                        totalRatings: { $sum: 1 },
                    },
                },
            ]);
            if (stats.length > 0) {
                return {
                    avgRating: parseFloat(stats[0].avgRating.toFixed(1)), // Round to 1 decimal
                    totalRatings: stats[0].totalRatings,
                };
            }
            return { avgRating: 0, totalRatings: 0 };
        });
    }
};
exports.ReviewRepository = ReviewRepository;
exports.ReviewRepository = ReviewRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], ReviewRepository);
