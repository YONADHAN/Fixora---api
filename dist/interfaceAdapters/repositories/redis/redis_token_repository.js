"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisTokenRepository = void 0;
const tsyringe_1 = require("tsyringe");
const redis_client_1 = require("./redis.client");
let RedisTokenRepository = class RedisTokenRepository {
    async storeResetToken(userId, token) {
        const key = `reset_token:${userId}`;
        await redis_client_1.redisClient.setEx(key, 300, token);
    }
    async verifyResetToken(userId, token) {
        const key = `reset_token:${userId}`;
        const storedToken = await redis_client_1.redisClient.get(key);
        return storedToken === token;
    }
    async deleteResetToken(userId) {
        const key = `reset_token:${userId}`;
        await redis_client_1.redisClient.del(key);
    }
};
exports.RedisTokenRepository = RedisTokenRepository;
exports.RedisTokenRepository = RedisTokenRepository = __decorate([
    (0, tsyringe_1.injectable)()
], RedisTokenRepository);
