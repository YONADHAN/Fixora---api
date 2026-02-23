"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewController = exports.paymentController = exports.blockMyUserMiddleware = exports.chatController = exports.notificationController = exports.walletController = exports.addressController = exports.stripeWebhookController = exports.bookingController = exports.serviceController = exports.subServiceCategoryController = exports.serviceCategoryController = exports.adminController = exports.customerController = exports.vendorController = exports.authController = void 0;
const tsyringe_1 = require("tsyringe");
const index_1 = require("./index");
const auth_controller_1 = require("../controllers/auth/auth_controller");
const vendor_controller_1 = require("../controllers/vendor/vendor_controller");
const customer_controller_1 = require("../controllers/customer/customer_controller");
const admin_controller_1 = require("../controllers/admin/admin_controller");
const block_middleware_1 = require("../middleware/block_middleware");
const service_category_controller_1 = require("../controllers/service/service_category_controller");
const sub_service_category_controller_1 = require("../controllers/service/sub_service_category_controller");
const service_controller_1 = require("../controllers/service/service_controller");
const pay_balance_usecase_1 = require("../../application/usecase/booking/pay_balance_usecase");
const balance_payment_succeeded_usecase_1 = require("../../application/usecase/booking/balance_payment_succeeded_usecase");
const booking_controller_1 = require("../controllers/booking/booking_controller");
const stripe_webhook_controller_1 = require("../controllers/webhook/stripe_webhook_controller");
const address_controller_1 = require("../controllers/address/address_controller");
const wallet_controller_1 = require("../controllers/wallet/wallet_controller");
const notification_controller_1 = require("../controllers/notification/notification_controller");
const chat_controller_1 = require("../controllers/chat/chat_controller");
const payment_controller_1 = require("../controllers/payment/payment_controller");
const review_controller_1 = require("../controllers/review/review_controller");
index_1.DependencyInjection.registerAll();
exports.authController = tsyringe_1.container.resolve(auth_controller_1.AuthController);
exports.vendorController = tsyringe_1.container.resolve(vendor_controller_1.VendorController);
exports.customerController = tsyringe_1.container.resolve(customer_controller_1.CustomerController);
exports.adminController = tsyringe_1.container.resolve(admin_controller_1.AdminController);
exports.serviceCategoryController = tsyringe_1.container.resolve(service_category_controller_1.ServiceCategoryController);
exports.subServiceCategoryController = tsyringe_1.container.resolve(sub_service_category_controller_1.SubServiceCategoryController);
exports.serviceController = tsyringe_1.container.resolve(service_controller_1.ServiceController);
tsyringe_1.container.register('IPayBalanceUseCase', {
    useClass: pay_balance_usecase_1.PayBalanceUseCase,
});
tsyringe_1.container.register('IBalancePaymentSucceededUseCase', {
    useClass: balance_payment_succeeded_usecase_1.BalancePaymentSucceededUseCase,
});
exports.bookingController = tsyringe_1.container.resolve(booking_controller_1.BookingController);
exports.stripeWebhookController = tsyringe_1.container.resolve(stripe_webhook_controller_1.StripeWebhookController);
exports.addressController = tsyringe_1.container.resolve(address_controller_1.AddressController);
exports.walletController = tsyringe_1.container.resolve(wallet_controller_1.WalletController);
exports.notificationController = tsyringe_1.container.resolve(notification_controller_1.NotificationController);
exports.chatController = tsyringe_1.container.resolve(chat_controller_1.ChatController);
//middleware
exports.blockMyUserMiddleware = tsyringe_1.container.resolve(block_middleware_1.BlockMyUserMiddleware);
exports.paymentController = tsyringe_1.container.resolve(payment_controller_1.PaymentController);
exports.reviewController = tsyringe_1.container.resolve(review_controller_1.ReviewController);
