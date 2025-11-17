"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    async findOne(filter) {
        return this.model.findOne(filter).lean();
    }
    async save(data) {
        return this.model.create(data);
    }
    async delete(filter) {
        return this.model.findOneAndDelete(filter).lean();
    }
    async update(filter, updateData) {
        return this.model
            .findOneAndUpdate(filter, { $set: updateData }, { new: true })
            .lean();
    }
    async findAll(page, limit, search = '') {
        const filter = search
            ? {
                name: { $regex: search, $options: 'i' },
            }
            : {};
        const results = await this.model
            .find(filter)
            .limit(limit)
            .skip((page - 1) * limit)
            .lean();
        return results;
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
