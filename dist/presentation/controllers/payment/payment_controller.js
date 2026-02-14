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
exports.PaymentController = void 0;
const tsyringe_1 = require("tsyringe");
const get_payments_usecase_1 = require("../../../application/usecase/payment/get_payments_usecase");
const constants_1 = require("../../../shared/constants");
const error_handler_1 = require("../../../shared/utils/error_handler");
let PaymentController = class PaymentController {
    constructor(_getPaymentsUseCase) {
        this._getPaymentsUseCase = _getPaymentsUseCase;
    }
    getPayments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10, search } = req.query;
                const { userId, role } = req.user;
                const payload = {
                    userId,
                    role,
                    page: Number(page),
                    limit: Number(limit),
                    search: search,
                };
                const result = yield this._getPaymentsUseCase.execute(payload);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: 'Payments fetched successfully',
                    data: result,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
};
exports.PaymentController = PaymentController;
exports.PaymentController = PaymentController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(get_payments_usecase_1.GetPaymentsUseCase)),
    __metadata("design:paramtypes", [get_payments_usecase_1.GetPaymentsUseCase])
], PaymentController);
