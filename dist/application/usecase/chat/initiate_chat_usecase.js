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
exports.InitiateChatUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const uuid_1 = require("uuid");
const custom_error_1 = require("../../../domain/utils/custom.error");
const constants_1 = require("../../../shared/constants");
let InitiateChatUseCase = class InitiateChatUseCase {
    constructor(chatRepository, bookingRepository, customerRepository, vendorRepository, serviceRepository) {
        this.chatRepository = chatRepository;
        this.bookingRepository = bookingRepository;
        this.customerRepository = customerRepository;
        this.vendorRepository = vendorRepository;
        this.serviceRepository = serviceRepository;
    }
    execute(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { bookingId, requesterId, requesterRole } = data;
            const booking = yield this.bookingRepository.getBookingById(bookingId);
            if (!booking) {
                throw new custom_error_1.CustomError('Booking not found', constants_1.HTTP_STATUS.NOT_FOUND);
            }
            const customer = yield this.customerRepository.findOne({ _id: booking.customerRef });
            const vendor = yield this.vendorRepository.findOne({ _id: booking.vendorRef });
            const service = yield this.serviceRepository.findOne({ _id: booking.serviceRef });
            if (!customer || !vendor || !service) {
                throw new custom_error_1.CustomError('Related entities (Customer, Vendor, or Service) not found', constants_1.HTTP_STATUS.NOT_FOUND);
            }
            const customerUuid = customer.userId;
            const vendorUuid = vendor.userId;
            const serviceUuid = service.serviceId;
            if (!customerUuid || !vendorUuid || !serviceUuid) {
                throw new custom_error_1.CustomError('Invalid entity data: Missing UUIDs', constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }
            const isCustomer = customerUuid === requesterId;
            const isVendor = vendorUuid === requesterId;
            if (!isCustomer && !isVendor) {
                throw new custom_error_1.CustomError('Unauthorized: You are not a party to this booking', constants_1.HTTP_STATUS.FORBIDDEN);
            }
            const existingChat = yield this.chatRepository.findChatByParticipants(customerUuid, vendorUuid, serviceUuid);
            if (existingChat) {
                return existingChat.chatId;
            }
            const newChat = yield this.chatRepository.createChat({
                chatId: (0, uuid_1.v4)(),
                customerId: customerUuid,
                vendorId: vendorUuid,
                serviceId: serviceUuid,
                unreadCount: { customer: 0, vendor: 0 },
                isActive: true,
                lastMessage: undefined,
            });
            return newChat.chatId;
        });
    }
};
exports.InitiateChatUseCase = InitiateChatUseCase;
exports.InitiateChatUseCase = InitiateChatUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IChatRepository')),
    __param(1, (0, tsyringe_1.inject)('IBookingRepository')),
    __param(2, (0, tsyringe_1.inject)('ICustomerRepository')),
    __param(3, (0, tsyringe_1.inject)('IVendorRepository')),
    __param(4, (0, tsyringe_1.inject)('IServiceRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], InitiateChatUseCase);
