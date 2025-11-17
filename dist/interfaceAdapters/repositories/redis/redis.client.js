"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const redis_1 = require("redis");
const config_1 = require("../../../shared/config");
const chalk_1 = __importDefault(require("chalk"));
exports.redisClient = (0, redis_1.createClient)({
    username: config_1.config.redis.REDIS_USERNAME,
    password: config_1.config.redis.REDIS_PASS,
    socket: {
        host: config_1.config.redis.REDIS_HOST,
        port: parseInt(config_1.config.redis.REDIS_PORT),
    },
});
exports.redisClient.on('error', (err) => console.log('Redis Client Error', err));
(async () => {
    await exports.redisClient.connect();
    console.log(chalk_1.default.yellowBright.bold('\t         ' +
        chalk_1.default.blueBright.bold('📦 Redis connected successfully!') +
        '            '));
})();
