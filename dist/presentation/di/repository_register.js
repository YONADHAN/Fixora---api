"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryRegistry = void 0;
const tsyringe_1 = require("tsyringe");
const otp_repository_1 = require("../../interfaceAdapters/repositories/auth/otp_repository");
const customer_repository_1 = require("../../interfaceAdapters/repositories/users/customer_repository");
const admin_repository_1 = require("../../interfaceAdapters/repositories/users/admin_repository");
const vendor_repository_1 = require("../../interfaceAdapters/repositories/users/vendor_repository");
const refresh_token_repositories_1 = require("../../interfaceAdapters/repositories/auth/refresh_token_repositories");
const redis_token_repository_1 = require("../../interfaceAdapters/repositories/redis/redis_token_repository");
const service_category_repository_1 = require("../../interfaceAdapters/repositories/feature/service/service_category_repository");
const sub_service_category_repository_1 = require("../../interfaceAdapters/repositories/feature/service/sub_service_category_repository");
const service_repository_1 = require("../../interfaceAdapters/repositories/feature/service/service_repository");
const booking_repository_1 = require("../../interfaceAdapters/repositories/feature/booking/booking_repository");
const booking_hold_repository_1 = require("../../interfaceAdapters/repositories/feature/booking/booking_hold_repository");
const redis_slot_lock_repository_1 = require("../../interfaceAdapters/repositories/redis/redis_slot_lock_repository");
const wallet_repository_1 = require("../../interfaceAdapters/repositories/feature/payment/wallet_repository");
const wallet_transaction_repository_1 = require("../../interfaceAdapters/repositories/feature/payment/wallet_transaction_repository");
const address_repository_1 = require("../../interfaceAdapters/repositories/feature/address/address_repository");
const payment_repository_1 = require("../../interfaceAdapters/repositories/feature/payment/payment_repository");
const notification_repository_1 = require("../../interfaceAdapters/repositories/feature/notification/notification_repository");
const chat_repository_1 = require("../../interfaceAdapters/repositories/feature/chat/chat_repository");
const message_repository_1 = require("../../interfaceAdapters/repositories/feature/chat/message_repository");
const review_repository_1 = require("../../interfaceAdapters/repositories/feature/review/review_repository");
class RepositoryRegistry {
    static registerRepositories() {
        tsyringe_1.container.register('IOtpRepository', {
            useClass: otp_repository_1.OtpRepository,
        });
        tsyringe_1.container.register('ICustomerRepository', {
            useClass: customer_repository_1.CustomerRepository,
        });
        tsyringe_1.container.register('IAdminRepository', {
            useClass: admin_repository_1.AdminRepository,
        });
        tsyringe_1.container.register('IVendorRepository', {
            useClass: vendor_repository_1.VendorRepository,
        });
        tsyringe_1.container.register('IRefreshTokenRepository', {
            useClass: refresh_token_repositories_1.RefreshTokenRepository,
        });
        tsyringe_1.container.register('IRedisTokenRepository', {
            useClass: redis_token_repository_1.RedisTokenRepository,
        });
        tsyringe_1.container.register('IServiceCategoryRepository', {
            useClass: service_category_repository_1.ServiceCategoryRepository,
        });
        tsyringe_1.container.register('ISubServiceCategoryRepository', {
            useClass: sub_service_category_repository_1.SubServiceCategoryRepository,
        });
        tsyringe_1.container.register('IServiceRepository', {
            useClass: service_repository_1.ServiceRepository,
        });
        tsyringe_1.container.register('IBookingRepository', {
            useClass: booking_repository_1.BookingRepository,
        });
        tsyringe_1.container.register('IBookingHoldRepository', {
            useClass: booking_hold_repository_1.BookingHoldRepository,
        });
        tsyringe_1.container.register('IRedisSlotLockRepository', {
            useClass: redis_slot_lock_repository_1.RedisSlotLockRepository,
        });
        tsyringe_1.container.register('IWalletRepository', {
            useClass: wallet_repository_1.WalletRepository,
        });
        tsyringe_1.container.register('IWalletTransactionRepository', {
            useClass: wallet_transaction_repository_1.WalletTransactionRepository,
        });
        tsyringe_1.container.register('IAddressRepository', {
            useClass: address_repository_1.AddressRepository,
        });
        tsyringe_1.container.register('IPaymentRepository', {
            useClass: payment_repository_1.PaymentRepository,
        });
        tsyringe_1.container.register('INotificationRepository', {
            useClass: notification_repository_1.NotificationRepository,
        });
        tsyringe_1.container.register('IChatRepository', {
            useClass: chat_repository_1.ChatRepository,
        });
        tsyringe_1.container.register('IMessageRepository', {
            useClass: message_repository_1.MessageRepository,
        });
        tsyringe_1.container.register('IReviewRepository', {
            useClass: review_repository_1.ReviewRepository,
        });
    }
}
exports.RepositoryRegistry = RepositoryRegistry;
