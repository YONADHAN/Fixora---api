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
    toEntityArray(models) {
        return models.map((m) => this.toEntity(m));
    }
    findOne(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.findOne(filter).lean();
            return result ? this.toEntity(result) : null;
        });
    }
    findAllDocsWithoutPagination(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.find(filter).lean();
            return this.toEntityArray(result);
        });
    }
    save(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const modelData = this.toModel(data);
            const doc = yield this.model.create(modelData);
            return this.toEntity(doc.toObject());
        });
    }
    delete(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.findOneAndDelete(filter).lean();
            return result ? this.toEntity(result) : null;
        });
    }
    update(filter, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const modelData = this.toModel(updateData);
            const result = yield this.model
                .findOneAndUpdate(filter, { $set: modelData }, { new: true })
                .lean();
            return result ? this.toEntity(result) : null;
        });
    }
    findAll(page_1, limit_1) {
        return __awaiter(this, arguments, void 0, function* (page, limit, search = '') {
            const filter = search
                ? { name: { $regex: search, $options: 'i' } }
                : {};
            const results = yield this.model
                .find(filter)
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 })
                .lean();
            return this.toEntityArray(results);
        });
    }
    findAllDocuments(page_1, limit_1) {
        return __awaiter(this, arguments, void 0, function* (page, limit, search = '') {
            const filter = search
                ? { name: { $regex: search, $options: 'i' } }
                : {};
            const total = yield this.model.countDocuments(filter);
            const results = yield this.model
                .find(filter)
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 })
                .lean();
            return {
                data: this.toEntityArray(results),
                currentPage: page,
                totalPages: Math.ceil(total / limit),
            };
        });
    }
    findAllDocumentsWithFilteration(page_1, limit_1) {
        return __awaiter(this, arguments, void 0, function* (page, limit, search = '', extraFilters = {}) {
            const filter = Object.assign(Object.assign({}, extraFilters), (search
                ? {
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { title: { $regex: search, $options: 'i' } },
                    ],
                }
                : {}));
            const total = yield this.model.countDocuments(filter);
            const results = yield this.model
                .find(filter)
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 })
                .lean();
            return {
                data: this.toEntityArray(results),
                currentPage: page,
                totalPages: Math.ceil(total / limit),
            };
        });
    }
    findOneAndPopulate(filter, populateFields) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = this.model.findOne(filter);
            if (Array.isArray(populateFields)) {
                for (const field of populateFields) {
                    query = query.populate(field);
                }
            }
            else {
                query = query.populate(populateFields);
            }
            const result = yield query.lean();
            return result ? this.toEntity(result) : null;
        });
    }
    countDocuments() {
        return __awaiter(this, arguments, void 0, function* (filter = {}) {
            return this.model.countDocuments(filter);
        });
    }
    findAllDocumentsWithFilterationAndPopulate(page_1, limit_1) {
        return __awaiter(this, arguments, void 0, function* (page, limit, search = '', extraFilters = {}, populateFields) {
            const filter = Object.assign(Object.assign({}, extraFilters), (search
                ? {
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { title: { $regex: search, $options: 'i' } },
                    ],
                }
                : {}));
            const total = yield this.model.countDocuments(filter);
            let query = this.model
                .find(filter)
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 });
            if (populateFields) {
                if (Array.isArray(populateFields)) {
                    populateFields.forEach((field) => {
                        query = query.populate(field);
                    });
                }
                else {
                    query = query.populate(populateFields);
                }
            }
            const results = yield query.lean();
            return {
                data: this.toEntityArray(results),
                currentPage: page,
                totalPages: Math.ceil(total / limit),
            };
        });
    }
}
exports.BaseRepository = BaseRepository;
