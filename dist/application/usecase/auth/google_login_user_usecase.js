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
exports.GoogleLoginUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const google_auth_library_1 = require("google-auth-library");
const config_1 = require("../../../shared/config");
const google_register_user_usecase_1 = require("./google_register_user_usecase");
const custom_error_1 = require("../../../domain/utils/custom.error");
const constants_1 = require("../../../shared/constants");
let GoogleLoginUseCase = class GoogleLoginUseCase {
    constructor(_googleRegisterUseCase) {
        this._googleRegisterUseCase = _googleRegisterUseCase;
        this._client = new google_auth_library_1.OAuth2Client(config_1.config.googleAuth.GOOGLE_CLIENT_ID);
    }
    execute(credential, client_id, role) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!['customer', 'vendor'].includes(role)) {
                throw new custom_error_1.CustomError('Google login not supported for this role', constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            const ticket = yield this._client.verifyIdToken({
                idToken: credential,
                audience: client_id,
            });
            const payload = ticket.getPayload();
            if (!payload)
                throw new custom_error_1.CustomError('Invalid Google token', constants_1.HTTP_STATUS.UNAUTHORIZED);
            const user = {
                name: payload.name || '',
                email: payload.email || '',
                googleId: payload.sub || '',
                role: role,
            };
            return yield this._googleRegisterUseCase.execute(user);
        });
    }
};
exports.GoogleLoginUseCase = GoogleLoginUseCase;
exports.GoogleLoginUseCase = GoogleLoginUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IGoogleRegisterUserUseCase')),
    __metadata("design:paramtypes", [google_register_user_usecase_1.GoogleRegisterUserUseCase])
], GoogleLoginUseCase);
