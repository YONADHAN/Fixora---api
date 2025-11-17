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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tsyringe_1 = require("tsyringe");
const config_1 = require("../../shared/config");
let JWTService = class JWTService {
    constructor() {
        this._accessSecret = config_1.config.jwt.ACCESS_SECRET_KEY;
        this._accessExpiresIn = config_1.config.jwt.ACCESS_EXPIRES_IN;
        this._refreshSecret = config_1.config.jwt.REFRESH_SECRET_KEY;
        this._refreshExpiresIn = config_1.config.jwt.REFRESH_EXPIRES_IN;
        this._resetSecret = config_1.config.jwt.RESET_SECRET_KEY;
        this._resetExpiresIn = config_1.config.jwt.RESET_EXPIRES_IN;
    }
    generateAccessToken(payload) {
        return jsonwebtoken_1.default.sign(payload, this._accessSecret, {
            expiresIn: this._accessExpiresIn,
        });
    }
    generateRefreshToken(payload) {
        return jsonwebtoken_1.default.sign(payload, this._refreshSecret, {
            expiresIn: this._refreshExpiresIn,
        });
    }
    verifyAccessToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, this._accessSecret);
        }
        catch (error) {
            return null;
        }
    }
    verifyRefreshToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, this._refreshSecret);
        }
        catch (error) {
            return null;
        }
    }
    decodeAccessToken(token) {
        try {
            return jsonwebtoken_1.default.decode(token);
        }
        catch (error) {
            return null;
        }
    }
    generateResetToken(email) {
        return jsonwebtoken_1.default.sign({ email }, this._resetSecret, {
            expiresIn: this._resetExpiresIn,
        });
    }
    verifyResetToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, this._resetSecret);
        }
        catch (error) {
            return null;
        }
    }
    decodeResetToken(token) {
        try {
            return jsonwebtoken_1.default.decode(token);
        }
        catch (error) {
            return null;
        }
    }
};
exports.JWTService = JWTService;
exports.JWTService = JWTService = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], JWTService);
