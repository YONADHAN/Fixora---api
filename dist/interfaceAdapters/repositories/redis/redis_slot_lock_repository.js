"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.RedisSlotLockRepository = void 0;
const tsyringe_1 = require("tsyringe");
const redis_client_1 = require("./redis.client");
let RedisSlotLockRepository = class RedisSlotLockRepository {
    buildSlotKey(serviceId, date, start) {
        return `slot:${serviceId}:${date}:${start}`;
    }
    lockSlot(serviceId_1, date_1, start_1) {
        return __awaiter(this, arguments, void 0, function* (serviceId, date, start, ttlSeconds = 300) {
            const key = this.buildSlotKey(serviceId, date, start);
            const result = yield redis_client_1.redisClient.set(key, 'locked', {
                NX: true,
                EX: ttlSeconds,
            });
            return result === 'OK';
        });
    }
    releaseSlot(serviceId, date, start) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = this.buildSlotKey(serviceId, date, start);
            yield redis_client_1.redisClient.del(key);
        });
    }
    releaseMultipleSlots(serviceId, slots) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!slots.length)
                return;
            const keys = slots.map((s) => this.buildSlotKey(serviceId, s.date, s.start));
            yield redis_client_1.redisClient.del(keys);
        });
    }
};
exports.RedisSlotLockRepository = RedisSlotLockRepository;
exports.RedisSlotLockRepository = RedisSlotLockRepository = __decorate([
    (0, tsyringe_1.injectable)()
], RedisSlotLockRepository);
