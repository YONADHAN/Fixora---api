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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlacklistTokenUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const redis_client_1 = require("../../../interfaceAdapters/repositories/redis/redis.client");
let BlacklistTokenUseCase = class BlacklistTokenUseCase {
    constructor(tokenService) {
        this.tokenService = tokenService;
    }
    async execute(token) {
        // console.log('hitting blacklist token usecase')
        const decoded = this.tokenService.verifyAccessToken(token);
        // console.log('decoded from the blacklist_token_usecase:', decoded)
        if (!decoded || typeof decoded !== 'object' || !('exp' in decoded)) {
            throw new Error('Invalid token: Missing or malformed payload');
        }
        // console.log(
        //   'verification of the access token of the user happens in the blacklist usecase'
        // )
        const now = Math.floor(Date.now() / 1000);
        const expiresIn = decoded.exp - now;
        // console.log('setting expires in for the token', expiresIn)
        if (expiresIn > 0) {
            await redis_client_1.redisClient.set(token, 'blacklisted', { EX: expiresIn });
        }
        // console.log('redisClient sets the blacklist access token of the user ')
    }
};
exports.BlacklistTokenUseCase = BlacklistTokenUseCase;
exports.BlacklistTokenUseCase = BlacklistTokenUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('ITokenService')),
    __metadata("design:paramtypes", [Object])
], BlacklistTokenUseCase);
