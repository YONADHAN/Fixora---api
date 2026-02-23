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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const tsyringe_1 = require("tsyringe");
const config_1 = require("../../shared/config");
const nodemailer_1 = __importDefault(require("nodemailer"));
const chalk_1 = __importDefault(require("chalk"));
const constants_1 = require("../../shared/constants");
let EmailService = class EmailService {
    constructor() {
        this._transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: config_1.config.nodemailer.EMAIL_USER,
                pass: config_1.config.nodemailer.EMAIL_PASS,
            },
        });
    }
    _sendMail(mailOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const info = yield this._transporter.sendMail(mailOptions);
            console.log(chalk_1.default.bgGreenBright.bold(`📧Email Sent:`), info.response);
        });
    }
    sendOtpEmail(to, subject, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                from: `"Fixora" <${config_1.config.nodemailer.EMAIL_USER}>`,
                to,
                subject,
                html: (0, constants_1.VERIFICATION_MAIL_CONTENT)(otp),
            };
            yield this._sendMail(mailOptions);
        });
    }
    sendResetEmail(to, subject, resetLink) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                from: `Fixora <${config_1.config.nodemailer.EMAIL_USER}>`,
                to,
                subject,
                html: (0, constants_1.PASSWORD_RESET_MAIL_CONTENT)(resetLink),
            };
            yield this._sendMail(mailOptions);
            console.log(chalk_1.default.bgBlue.italic(`Reset Password Link:`), chalk_1.default.cyanBright.bold(resetLink));
        });
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
