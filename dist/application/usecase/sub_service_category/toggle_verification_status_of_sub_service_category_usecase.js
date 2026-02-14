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
exports.ToggleVerificationStatusOfSubServiceCategoryUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../../domain/utils/custom.error");
const constants_1 = require("../../../shared/constants");
let ToggleVerificationStatusOfSubServiceCategoryUseCase = class ToggleVerificationStatusOfSubServiceCategoryUseCase {
    constructor(_subServiceCategoryRepository) {
        this._subServiceCategoryRepository = _subServiceCategoryRepository;
    }
    execute(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { subServiceCategoryId, verificationStatus } = payload;
            const subServiceCategoryExists = yield this._subServiceCategoryRepository.findOne({ subServiceCategoryId });
            if (!subServiceCategoryExists) {
                throw new custom_error_1.CustomError('Sub Service Category Is Not Found', constants_1.HTTP_STATUS.NOT_FOUND);
            }
            const oldStatus = subServiceCategoryExists.verification;
            if (verificationStatus === oldStatus) {
                throw new custom_error_1.CustomError(`State ${verificationStatus} already exists.`, constants_1.HTTP_STATUS.CONFLICT);
            }
            const data = {
                verification: verificationStatus,
            };
            yield this._subServiceCategoryRepository.update({ subServiceCategoryId }, data);
        });
    }
};
exports.ToggleVerificationStatusOfSubServiceCategoryUseCase = ToggleVerificationStatusOfSubServiceCategoryUseCase;
exports.ToggleVerificationStatusOfSubServiceCategoryUseCase = ToggleVerificationStatusOfSubServiceCategoryUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('ISubServiceCategoryRepository')),
    __metadata("design:paramtypes", [Object])
], ToggleVerificationStatusOfSubServiceCategoryUseCase);
