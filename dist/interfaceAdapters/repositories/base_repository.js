"use strict";
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
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    findOne(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findOne(filter).lean();
        });
    }
    save(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.create(data);
        });
    }
    delete(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findOneAndDelete(filter).lean();
        });
    }
    update(filter, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model
                .findOneAndUpdate(filter, { $set: updateData }, { new: true })
                .lean();
        });
    }
    findAll(page_1, limit_1) {
        return __awaiter(this, arguments, void 0, function* (page, limit, search = '') {
            const filter = search
                ? {
                    name: { $regex: search, $options: 'i' },
                }
                : {};
            const results = yield this.model
                .find(filter)
                .limit(limit)
                .skip((page - 1) * limit)
                .lean();
            return results;
        });
    }
    findAllDocuments(page_1, limit_1) {
        return __awaiter(this, arguments, void 0, function* (page, limit, search = '') {
            const filter = search
                ? {
                    name: { $regex: search, $options: 'i' },
                }
                : {};
            const totalItems = yield this.model.countDocuments(filter);
            const results = yield this.model
                .find(filter)
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 })
                .lean();
            return {
                data: results,
                currentPage: page,
                totalPages: Math.ceil(totalItems / limit),
            };
        });
    }
}
exports.BaseRepository = BaseRepository;
// async findAll(page: number, limit: number, search: string) {
//   const filter = search
//     ? { name: { $regex: search, $options: 'i' } }
//     : {}
//   const totalItems = await this.model.countDocuments(filter)
//   const results = await this.model
//     .find(filter)
//     .skip((page - 1) * limit)
//     .limit(limit)
//     .lean()
//   return {
//     categories: results,
//     totalPages: Math.ceil(totalItems / limit)
//   }
// }
