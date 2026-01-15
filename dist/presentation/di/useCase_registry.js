"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseCaseRegistry = void 0;
const tsyringe_1 = require("tsyringe");
//service
const email_service_1 = require("../../interfaceAdapters/services/email_service");
const user_existence_service_1 = require("../../interfaceAdapters/services/user_existence.service");
const otp_service_1 = require("../../interfaceAdapters/services/otp_service");
const jwt_service_1 = require("../../interfaceAdapters/services/jwt_service");
const s3_storage_service_1 = require("../../interfaceAdapters/services/s3_storage_service");
const otp_bcrypt_1 = require("../security/otp_bcrypt");
const password_bcrypt_1 = require("../security/password_bcrypt");
//usecase
const send_otp_email_useCase_1 = require("../../application/usecase/auth/send_otp_email_useCase");
const verify_otp_usecase_1 = require("../../application/usecase/auth/verify_otp_usecase");
const register_user_usecase_1 = require("../../application/usecase/auth/register_user_usecase");
const generate_token_usecase_1 = require("../../application/usecase/auth/generate_token_usecase");
const login_user_usecase_1 = require("../../application/usecase/auth/login_user_usecase");
const forgot_password_usecase_1 = require("../../application/usecase/auth/forgot_password_usecase");
const reset_password_usecase_1 = require("../../application/usecase/auth/reset_password_usecase");
const blacklist_token_usecase_1 = require("../../application/usecase/auth/blacklist_token_usecase");
const revoke_refresh_token_usecase_1 = require("../../application/usecase/auth/revoke_refresh_token_usecase");
const refresh_token_usecase_1 = require("../../application/usecase/auth/refresh_token_usecase");
const get_profile_info_usecase_1 = require("../../application/usecase/common/get_profile_info_usecase");
const profile_info_update_usecase_1 = require("../../application/usecase/common/profile_info_update_usecase");
const get_all_users_usecase_1 = require("../../application/usecase/common/get_all_users_usecase");
const change_my_user_block_status_usecase_1 = require("../../application/usecase/admin/block-status/change_my_user_block_status_usecase");
const google_login_user_usecase_1 = require("../../application/usecase/auth/google_login_user_usecase");
const google_register_user_usecase_1 = require("../../application/usecase/auth/google_register_user_usecase");
const upload_vendor_docs_usecase_1 = require("../../application/usecase/vendor/upload_vendor_docs.usecase");
const get_all_vendor_requests_usecase_1 = require("../../application/usecase/admin/verification-requests/get_all_vendor_requests_usecase");
const change_vendor_verification_status_usecase_1 = require("../../application/usecase/admin/verification-requests/change_vendor_verification_status_usecase");
const change_my_password_usecase_1 = require("../../application/usecase/auth/change_my_password_usecase");
const service_category_usecase_1 = require("../../application/usecase/service_category/service_category_usecase");
const create_service_category_usecase_1 = require("../../application/usecase/service_category/create_service_category_usecase");
const edit_service_category_usecase_1 = require("../../application/usecase/service_category/edit_service_category_usecase");
const block_service_category_usecase_1 = require("../../application/usecase/service_category/block_service_category_usecase");
const single_service_category_usecase_1 = require("../../application/usecase/service_category/single_service_category_usecase");
const active_service_categories_usecase_1 = require("../../application/usecase/service_category/active_service_categories_usecase");
const create_sub_service_category_usecase_1 = require("../../application/usecase/sub_service_category/create_sub_service_category_usecase");
const edit_sub_service_category_usecase_1 = require("../../application/usecase/sub_service_category/edit_sub_service_category_usecase");
const get_all_sub_service_category_usecase_1 = require("../../application/usecase/sub_service_category/get_all_sub_service_category_usecase");
const get_single_sub_service_category_usecase_1 = require("../../application/usecase/sub_service_category/get_single_sub_service_category_usecase");
const toggle_block_status_of_sub_service_category_usecase_1 = require("../../application/usecase/sub_service_category/toggle_block_status_of_sub_service_category_usecase");
const toggle_verification_status_of_sub_service_category_usecase_1 = require("../../application/usecase/sub_service_category/toggle_verification_status_of_sub_service_category_usecase");
const search_services_for_customers_usecase_1 = require("../../application/usecase/service/search_services_for_customers_usecase");
const get_available_slots_for_customer_usecase_1 = require("../../application/usecase/booking/get_available_slots_for_customer_usecase");
const create_booking_hold_usecase_1 = require("../../application/usecase/booking_hold/create_booking_hold_usecase");
const get_booking_usecase_1 = require("../../application/usecase/booking/get_booking_usecase");
const cancel_booking_usecase_1 = require("../../application/usecase/booking/cancel_booking_usecase");
//factory
const registration_strategy_factory_1 = require("../../application/factories/auth/registration/registration_strategy_factory");
const login_strategy_factory_1 = require("../../application/factories/auth/login/login_strategy_factory");
const forgot_password_strategy_factory_1 = require("../../application/factories/auth/forgot_password/forgot_password_strategy_factory");
const reset_password_strategy_factory_1 = require("../../application/factories/auth/reset_password/reset_password_strategy_factory");
const profile_factory_1 = require("../../application/factories/commonFeatures/profile/profile_factory");
const profile_update_factory_1 = require("../../application/factories/commonFeatures/profile/profile_update_factory");
const get_all_users_factory_1 = require("../../application/factories/commonFeatures/users/get_all_users_factory");
const change_my_user_block_status_factory_1 = require("../../application/factories/admin/block_status/change_my_user_block_status_factory");
const google_registration_strategy_factory_1 = require("../../application/factories/auth/registration/google/google_registration_strategy_factory");
const change_password_strategy_factory_1 = require("../../application/factories/auth/change_password/change_password_strategy_factory");
const profile_image_upload_factory_1 = require("../../application/factories/commonFeatures/profile/profile_image_upload_factory");
const get_booking_factory_1 = require("../../application/factories/booking/get_booking_factory");
const cancel_booking_factory_1 = require("../../application/factories/booking/cancel_booking_factory");
const payment_history_factory_1 = require("../../application/factories/payment_history_factory/payment_history_factory");
const user_mapper_factory_impl_1 = require("../../application/mappers/mapper_factories/user_mapper_factory.impl");
//Mapper
const customer_safe_user_mapper_1 = require("../../application/mappers/customer/customer_safe_user_mapper");
const vendor_safe_user_mapper_1 = require("../../application/mappers/vendor/vendor_safe_user_mapper");
//strategy
const customer_registration_strategy_1 = require("../../application/strategies/auth/registration/customer_registration_strategy");
const admin_registration_strategy_1 = require("../../application/strategies/auth/registration/admin_registration_strategy");
const vendor_registration_strategy_1 = require("../../application/strategies/auth/registration/vendor_registration_strategy");
const admin_login_strategy_1 = require("../../application/strategies/auth/login/admin_login_strategy");
const customer_login_strategy_1 = require("../../application/strategies/auth/login/customer_login_strategy");
const vendor_login_strategy_1 = require("../../application/strategies/auth/login/vendor_login_strategy");
const admin_forgot_password_strategy_1 = require("../../application/strategies/auth/forgot_password/admin_forgot_password_strategy");
const customer_forgot_password_strategy_1 = require("../../application/strategies/auth/forgot_password/customer_forgot_password_strategy");
const vendor_forgot_password_strategy_1 = require("../../application/strategies/auth/forgot_password/vendor_forgot_password_strategy");
const admin_reset_password_strategy_1 = require("../../application/strategies/auth/reset_password/admin_reset_password_strategy");
const vendor_reset_password_strategy_1 = require("../../application/strategies/auth/reset_password/vendor_reset_password_strategy");
const customer_reset_password_strategy_1 = require("../../application/strategies/auth/reset_password/customer_reset_password_strategy");
const customer_profile_strategy_1 = require("../../application/strategies/commonFeatures/profile/customer_profile_strategy");
const vendor_profile_strategy_1 = require("../../application/strategies/commonFeatures/profile/vendor_profile_strategy");
const customer_profile_update_strategy_1 = require("../../application/strategies/commonFeatures/profile/customer_profile_update_strategy");
const vendor_profile_update_strategy_1 = require("../../application/strategies/commonFeatures/profile/vendor_profile_update_strategy");
const fetching_customers_strategy_1 = require("../../application/strategies/commonFeatures/users/fetching_customers_strategy");
const fetching_vendors_strategy_1 = require("../../application/strategies/commonFeatures/users/fetching_vendors_strategy");
const change_my_customers_block_status_strategy_1 = require("../../application/strategies/commonFeatures/users/block_status/change_my_customers_block_status_strategy");
const change_my_vendors_block_status_strategy_1 = require("../../application/strategies/commonFeatures/users/block_status/change_my_vendors_block_status_strategy");
const customer_google_registration_strategy_1 = require("../../application/strategies/auth/registration/google/customer_google_registration_strategy");
const vendor_google_registration_strategy_1 = require("../../application/strategies/auth/registration/google/vendor_google_registration_strategy");
const vendor_status_check_usecase_1 = require("../../application/usecase/vendor/vendor_status_check_usecase");
const change_admin_password_strategy_1 = require("../../application/strategies/auth/change_password/change_admin_password_strategy");
const change_vendor_password_strategy_1 = require("../../application/strategies/auth/change_password/change_vendor_password_strategy");
const change_customer_password_strategy_1 = require("../../application/strategies/auth/change_password/change_customer_password_strategy");
const get_customer_payment_history_strategy_1 = require("../../application/strategies/payment/get_payment_history/get_customer_payment_history_strategy");
const get_vendor_payment_history_strategy_1 = require("../../application/strategies/payment/get_payment_history/get_vendor_payment_history_strategy");
const customer_profile_image_upload_strategy_1 = require("../../application/strategies/commonFeatures/profile/image/customer_profile_image_upload_strategy");
const vendor_profile_image_upload_strategy_1 = require("../../application/strategies/commonFeatures/profile/image/vendor_profile_image_upload_strategy");
const get_vendor_sub_service_categories_usecase_1 = require("../../application/usecase/sub_service_category/get_vendor_sub_service_categories_usecase");
const get_all_sub_service_categories_based_on_service_category_id_usecase_1 = require("../../application/usecase/sub_service_category/get_all_sub_service_categories_based_on_service_category_id_usecase");
const create_service_usecase_1 = require("../../application/usecase/service/create_service_usecase");
const get_all_service_usecase_1 = require("../../application/usecase/service/get_all_service_usecase");
const get_service_by_id_usecase_1 = require("../../application/usecase/service/get_service_by_id_usecase");
const edit_service_usecase_1 = require("../../application/usecase/service/edit_service_usecase");
const toggle_block_service_usecase_1 = require("../../application/usecase/service/toggle_block_service_usecase");
const get_active_sub_service_categories_usecase_1 = require("../../application/usecase/sub_service_category/get_active_sub_service_categories_usecase");
const booking_service_1 = require("../../interfaceAdapters/services/booking_service");
const create_stripe_payment_intent_usecase_1 = require("../../application/usecase/booking_hold/create_stripe_payment_intent_usecase");
const stripe_payment_succeeded_usecase_1 = require("../../application/usecase/booking_hold/stripe_payment_succeeded_usecase");
const stripe_payment_failed_usecase_1 = require("../../application/usecase/booking_hold/stripe_payment_failed_usecase");
const get_booking_for_admin_strategy_1 = require("../../application/strategies/booking/get_bookings/get_booking_for_admin_strategy");
const get_booking_for_vendor_strategy_1 = require("../../application/strategies/booking/get_bookings/get_booking_for_vendor_strategy");
const get_booking_for_customer_strategy_1 = require("../../application/strategies/booking/get_bookings/get_booking_for_customer_strategy");
const customer_cancel_booking_strategy_1 = require("../../application/strategies/booking/cancel_bookings/customer_cancel_booking_strategy");
const vendor_cancel_booking_strategy_1 = require("../../application/strategies/booking/cancel_bookings/vendor_cancel_booking_strategy");
const get_address_usecase_1 = require("../../application/usecase/address/get_address_usecase");
const edit_address_usecase_1 = require("../../application/usecase/address/edit_address_usecase");
const add_address_usecase_1 = require("../../application/usecase/address/add_address_usecase");
const set_default_address_usecase_1 = require("../../application/usecase/address/set_default_address_usecase");
const delete_address_usecase_1 = require("../../application/usecase/address/delete_address_usecase");
const get_single_address_usecase_1 = require("../../application/usecase/address/get_single_address_usecase");
const get_booking_details_usecase_1 = require("../../application/usecase/booking/get_booking_details_usecase");
const get_booking_details_for_customer_strategy_1 = require("../../application/strategies/booking/get_booking_details/get_booking_details_for_customer_strategy");
const get_booking_details_for_vendor_strategy_1 = require("../../application/strategies/booking/get_booking_details/get_booking_details_for_vendor_strategy");
const get_booking_details_factory_1 = require("../../application/factories/booking/get_booking_details_factory");
const get_my_wallet_usecase_1 = require("../../application/usecase/wallet/get_my_wallet_usecase");
const create_notification_usecase_1 = require("../../application/usecase/notification/create_notification_usecase");
const get_my_notifications_usecase_1 = require("../../application/usecase/notification/get_my_notifications_usecase");
const mark_all_notifications_read_usecase_1 = require("../../application/usecase/notification/mark_all_notifications_read_usecase");
const mark_notification_read_usecase_1 = require("../../application/usecase/notification/mark_notification_read_usecase");
const get_booking_by_payment_id_usecase_1 = require("../../application/usecase/booking/get_booking_by_payment_id_usecase");
const send_message_usecase_1 = require("../../application/usecase/chat/send_message_usecase");
const get_chat_messages_usecase_1 = require("../../application/usecase/chat/get_chat_messages_usecase");
const mark_chat_read_usecase_1 = require("../../application/usecase/chat/mark_chat_read_usecase");
const initiate_chat_usecase_1 = require("../../application/usecase/chat/initiate_chat_usecase");
const get_user_chats_usecase_1 = require("../../application/usecase/chat/get_user_chats_usecase");
class UseCaseRegistry {
    static registerUseCases() {
        tsyringe_1.container.register('IOtpService', {
            useClass: otp_service_1.OtpService,
        });
        tsyringe_1.container.register('ISendOtpEmailUseCase', {
            useClass: send_otp_email_useCase_1.sendOtpEmailUseCase,
        });
        tsyringe_1.container.register('IVerifyOtpUseCase', {
            useClass: verify_otp_usecase_1.VerifyOtpUseCase,
        });
        tsyringe_1.container.register('IRegisterUserUseCase', {
            useClass: register_user_usecase_1.RegisterUserUseCase,
        });
        tsyringe_1.container.register('IGenerateTokenUseCase', {
            useClass: generate_token_usecase_1.GenerateTokenUseCase,
        });
        tsyringe_1.container.register('ILoginUserUseCase', {
            useClass: login_user_usecase_1.LoginUserUseCase,
        });
        tsyringe_1.container.register('IForgotPasswordUseCase', {
            useClass: forgot_password_usecase_1.ForgotPasswordUseCase,
        });
        tsyringe_1.container.register('IResetPasswordUseCase', {
            useClass: reset_password_usecase_1.ResetPasswordUseCase,
        });
        tsyringe_1.container.register('IBlacklistTokenUseCase', {
            useClass: blacklist_token_usecase_1.BlacklistTokenUseCase,
        });
        tsyringe_1.container.register('IRevokeRefreshTokenUseCase', {
            useClass: revoke_refresh_token_usecase_1.RevokeRefreshTokenUseCase,
        });
        tsyringe_1.container.register('IRefreshTokenUseCase', {
            useClass: refresh_token_usecase_1.RefreshTokenUseCase,
        });
        tsyringe_1.container.register('IGetProfileInfoUseCase', {
            useClass: get_profile_info_usecase_1.GetProfileInfoUseCase,
        });
        tsyringe_1.container.register('IProfileInfoUpdateUseCase', {
            useClass: profile_info_update_usecase_1.ProfileInfoUpdateUseCase,
        });
        tsyringe_1.container.register('IGetAllUsersUseCase', {
            useClass: get_all_users_usecase_1.GetAllUsersUseCase,
        });
        tsyringe_1.container.register('IChangeMyUserBlockStatusUseCase', {
            useClass: change_my_user_block_status_usecase_1.ChangeMyUserBlockStatusUseCase,
        });
        tsyringe_1.container.register('IGoogleUseCase', {
            useClass: google_login_user_usecase_1.GoogleLoginUseCase,
        });
        tsyringe_1.container.register('IVendorStatusCheckUseCase', {
            useClass: vendor_status_check_usecase_1.VendorStatusCheckUsecase,
        });
        tsyringe_1.container.register('IChangeVendorVerificationStatusUseCase', {
            useClass: change_vendor_verification_status_usecase_1.ChangeVendorVerificationStatusUseCase,
        });
        tsyringe_1.container.register('IChangeMyPasswordUseCase', {
            useClass: change_my_password_usecase_1.ChangeMyPasswordUseCase,
        });
        tsyringe_1.container.register('ICreateServiceCategoryUseCase', {
            useClass: create_service_category_usecase_1.CreateServiceCategoryUseCase,
        });
        tsyringe_1.container.register('IGetAllServiceCategoryUseCase', {
            useClass: service_category_usecase_1.GetAllServiceCategoryUseCase,
        });
        tsyringe_1.container.register('IEditServiceCategoryUseCase', {
            useClass: edit_service_category_usecase_1.EditServiceCategoryUseCase,
        });
        tsyringe_1.container.register('IBlockServiceCategoryUseCase', {
            useClass: block_service_category_usecase_1.BlockServiceCategoryUseCase,
        });
        tsyringe_1.container.register('IGetSingleServiceCategoryUseCase', {
            useClass: single_service_category_usecase_1.GetSingleServiceCategoryUseCase,
        });
        tsyringe_1.container.register('IToggleVerificationStatusOfSubServiceCategoryUseCase', {
            useClass: toggle_verification_status_of_sub_service_category_usecase_1.ToggleVerificationStatusOfSubServiceCategoryUseCase,
        });
        tsyringe_1.container.register('ICreateServiceUseCase', {
            useClass: create_service_usecase_1.CreateServiceUseCase,
        });
        tsyringe_1.container.register('IGetAllServicesUseCase', {
            useClass: get_all_service_usecase_1.GetAllServicesUseCase,
        });
        tsyringe_1.container.register('IGetServiceByIdUseCase', {
            useClass: get_service_by_id_usecase_1.GetServiceByIdUseCase,
        });
        tsyringe_1.container.register('IEditServiceUseCase', {
            useClass: edit_service_usecase_1.EditServiceUseCase,
        });
        tsyringe_1.container.register('IToggleBlockServiceUseCase', {
            useClass: toggle_block_service_usecase_1.ToggleBlockServiceUseCase,
        });
        tsyringe_1.container.register('ISearchServicesForCustomersUseCase', {
            useClass: search_services_for_customers_usecase_1.SearchServicesForCustomersUseCase,
        });
        tsyringe_1.container.register('IGetAvailableSlotsForCustomerUseCase', {
            useClass: get_available_slots_for_customer_usecase_1.GetAvailableSlotsForCustomerUseCase,
        });
        tsyringe_1.container.register('ICreateBookingHoldUseCase', {
            useClass: create_booking_hold_usecase_1.CreateBookingHoldUseCase,
        });
        tsyringe_1.container.register('ICreateStripePaymentIntentUseCase', {
            useClass: create_stripe_payment_intent_usecase_1.CreateStripePaymentIntentUseCase,
        });
        tsyringe_1.container.register('IGetBookingsUseCase', {
            useClass: get_booking_usecase_1.GetBookingsUseCase,
        });
        tsyringe_1.container.register('ICancelBookingUseCase', {
            useClass: cancel_booking_usecase_1.CancelBookingUseCase,
        });
        tsyringe_1.container.register('IGetBookingDetailsUseCase', {
            useClass: get_booking_details_usecase_1.GetBookingDetailsUseCase,
        });
        tsyringe_1.container.register('IGetWalletUseCase', {
            useClass: get_my_wallet_usecase_1.GetWalletUseCase,
        });
        //security
        tsyringe_1.container.register('IPasswordBcrypt', {
            useClass: password_bcrypt_1.PasswordBcrypt,
        });
        tsyringe_1.container.register('IOtpBcrypt', {
            useClass: otp_bcrypt_1.OtpBcrypt,
        });
        tsyringe_1.container.register('IGoogleRegisterUserUseCase', {
            useClass: google_register_user_usecase_1.GoogleRegisterUserUseCase,
        });
        tsyringe_1.container.register('IUploadVendorDocsUseCase', {
            useClass: upload_vendor_docs_usecase_1.UploadVendorDocsUseCase,
        });
        tsyringe_1.container.register('IGetAllVendorRequestsUseCase', {
            useClass: get_all_vendor_requests_usecase_1.GetAllVendorRequestsUseCase,
        });
        tsyringe_1.container.register('IGetActiveServiceCategoriesUseCase', {
            useClass: active_service_categories_usecase_1.GetActiveServiceCategoriesUseCase,
        });
        tsyringe_1.container.register('ICreateSubServiceCategoryUseCase', {
            useClass: create_sub_service_category_usecase_1.CreateSubServiceCategoryUseCase,
        });
        tsyringe_1.container.register('IEditSubServiceCategoryUseCase', {
            useClass: edit_sub_service_category_usecase_1.EditSubServiceCategoryUseCase,
        });
        tsyringe_1.container.register('IGetAllSubServiceCategoryUseCase', {
            useClass: get_all_sub_service_category_usecase_1.GetAllSubServiceCategoryUseCase,
        });
        tsyringe_1.container.register('IGetSingleSubServiceCategoryUseCase', {
            useClass: get_single_sub_service_category_usecase_1.GetSingleSubServiceCategoryUseCase,
        });
        tsyringe_1.container.register('IToggleBlockStatusOfSubServiceCategoryUseCase', {
            useClass: toggle_block_status_of_sub_service_category_usecase_1.ToggleBlockStatusOfSubServiceCategoryUseCase,
        });
        tsyringe_1.container.register('IGetVendorSubServiceCategoriesUseCase', {
            useClass: get_vendor_sub_service_categories_usecase_1.GetVendorSubServiceCategoriesUseCase,
        });
        tsyringe_1.container.register('IGetActiveSubServiceCategoriesUseCase', {
            useClass: get_active_sub_service_categories_usecase_1.GetActiveSubServiceCategoriesUseCase,
        });
        tsyringe_1.container.register('IGetAllSubServiceCategoriesBasedOnServiceCategoryIdUseCase', {
            useClass: get_all_sub_service_categories_based_on_service_category_id_usecase_1.GetAllSubServiceCategoriesBasedOnServiceCategoryId,
        });
        tsyringe_1.container.register('IStripePaymentSucceedUseCase', {
            useClass: stripe_payment_succeeded_usecase_1.StripePaymentSucceededUseCase,
        });
        tsyringe_1.container.register('IStripePaymentFailedUseCase', {
            useClass: stripe_payment_failed_usecase_1.StripePaymentFailedUseCase,
        });
        tsyringe_1.container.register('IGetAddressUseCase', {
            useClass: get_address_usecase_1.GetAddressUseCase,
        });
        tsyringe_1.container.register('IEditAddressUseCase', {
            useClass: edit_address_usecase_1.EditAddressUseCase,
        });
        tsyringe_1.container.register('IAddAddressUseCase', {
            useClass: add_address_usecase_1.AddAddressUseCase,
        });
        tsyringe_1.container.register('ISetDefaultAddressUseCase', {
            useClass: set_default_address_usecase_1.SetDefaultAddressUseCase,
        });
        tsyringe_1.container.register('IDeleteAddressUseCase', {
            useClass: delete_address_usecase_1.DeleteAddressUseCase,
        });
        tsyringe_1.container.register('IGetSingleAddressUseCase', {
            useClass: get_single_address_usecase_1.GetSingleAddressUseCase,
        });
        tsyringe_1.container.register('ICreateNotificationUseCase', {
            useClass: create_notification_usecase_1.CreateNotificationUseCase,
        });
        tsyringe_1.container.register('IGetMyNotificationsUseCase', {
            useClass: get_my_notifications_usecase_1.GetMyNotificationsUseCase,
        });
        tsyringe_1.container.register('IMarkAllNotificationsReadUseCase', {
            useClass: mark_all_notifications_read_usecase_1.MarkAllNotificationsReadUseCase,
        });
        tsyringe_1.container.register('IMarkNotificationReadUseCase', {
            useClass: mark_notification_read_usecase_1.MarkNotificationReadUseCase,
        });
        tsyringe_1.container.register('ISendMessageUseCase', {
            useClass: send_message_usecase_1.SendMessageUseCase,
        });
        tsyringe_1.container.register('IGetBookingByPaymentIdUseCase', {
            useClass: get_booking_by_payment_id_usecase_1.GetBookingByPaymentIdUseCase,
        });
        tsyringe_1.container.register('IGetChatMessagesUseCase', {
            useClass: get_chat_messages_usecase_1.GetChatMessagesUseCase,
        });
        tsyringe_1.container.register('IMarkChatReadUseCase', {
            useClass: mark_chat_read_usecase_1.MarkChatReadUseCase,
        });
        tsyringe_1.container.register('IInitiateChatUseCase', {
            useClass: initiate_chat_usecase_1.InitiateChatUseCase,
        });
        tsyringe_1.container.register('IGetUserChatsUseCase', {
            useClass: get_user_chats_usecase_1.GetUserChatsUseCase,
        });
        //service
        tsyringe_1.container.register('IUserExistenceService', {
            useClass: user_existence_service_1.UserExistenceService,
        });
        tsyringe_1.container.register('IEmailService', {
            useClass: email_service_1.EmailService,
        });
        tsyringe_1.container.register('ITokenService', {
            useClass: jwt_service_1.JWTService,
        });
        tsyringe_1.container.register('IStorageService', {
            useClass: s3_storage_service_1.S3StorageService,
        });
        tsyringe_1.container.register('ICustomerGoogleRegistrationStrategy', {
            useClass: customer_google_registration_strategy_1.CustomerGoogleRegistrationStrategy,
        });
        tsyringe_1.container.register('IVendorGoogleRegistrationStrategy', {
            useClass: vendor_google_registration_strategy_1.VendorGoogleRegistrationStrategy,
        });
        tsyringe_1.container.register('IBookingServices', {
            useClass: booking_service_1.BookingServices,
        });
        //factory
        tsyringe_1.container.register('IRegistrationStrategyFactory', {
            useClass: registration_strategy_factory_1.RegistrationStrategyFactory,
        });
        tsyringe_1.container.register('ILoginStrategyFactory', {
            useClass: login_strategy_factory_1.LoginStrategyFactory,
        });
        tsyringe_1.container.register('IForgotPasswordStrategyFactory', {
            useClass: forgot_password_strategy_factory_1.ForgotPasswordStrategyFactory,
        });
        tsyringe_1.container.register('IResetPasswordStrategyFactory', {
            useClass: reset_password_strategy_factory_1.ResetPasswordStrategyFactory,
        });
        tsyringe_1.container.register('IProfileFactory', {
            useClass: profile_factory_1.ProfileFactory,
        });
        tsyringe_1.container.register('IProfileUpdateFactory', {
            useClass: profile_update_factory_1.ProfileUpdateFactory,
        });
        tsyringe_1.container.register('IGetAllUsersFactory', {
            useClass: get_all_users_factory_1.GetAllUsersFactory,
        });
        tsyringe_1.container.register('IChangeMyUserBlockStatusFactory', {
            useClass: change_my_user_block_status_factory_1.ChangeMyUserBlockStatusFactory,
        });
        tsyringe_1.container.register('IGoogleRegistrationStrategyFactory', {
            useClass: google_registration_strategy_factory_1.GoogleRegistrationStrategyFactory,
        });
        tsyringe_1.container.register('IUserMapperFactory', {
            useClass: user_mapper_factory_impl_1.UserMapperFactory,
        });
        tsyringe_1.container.register('IChangePasswordFactory', {
            useClass: change_password_strategy_factory_1.ChangePasswordFactory,
        });
        tsyringe_1.container.register('IProfileImageUploadFactory', {
            useClass: profile_image_upload_factory_1.ProfileImageUploadFactory,
        });
        tsyringe_1.container.register('IGetBookingsFactory', {
            useClass: get_booking_factory_1.GetBookingsFactory,
        });
        tsyringe_1.container.register('ICancelBookingFactory', {
            useClass: cancel_booking_factory_1.CancelBookingFactory,
        });
        tsyringe_1.container.register('IGetBookingDetailsFactory', {
            useClass: get_booking_details_factory_1.GetBookingDetailsFactory,
        });
        tsyringe_1.container.register('IPaymentHistoryFactory', {
            useClass: payment_history_factory_1.PaymentHistoryFactory,
        });
        //strategy
        tsyringe_1.container.register('ICustomerRegistrationStrategy', {
            useClass: customer_registration_strategy_1.CustomerRegistrationStrategy,
        });
        tsyringe_1.container.register('IAdminRegistrationStrategy', {
            useClass: admin_registration_strategy_1.AdminRegistrationStrategy,
        });
        tsyringe_1.container.register('IVendorRegistrationStrategy', {
            useClass: vendor_registration_strategy_1.VendorRegistrationStrategy,
        });
        tsyringe_1.container.register('IAdminLoginStrategy', {
            useClass: admin_login_strategy_1.AdminLoginStrategy,
        });
        tsyringe_1.container.register('ICustomerLoginStrategy', {
            useClass: customer_login_strategy_1.CustomerLoginStrategy,
        });
        tsyringe_1.container.register('IVendorLoginStrategy', {
            useClass: vendor_login_strategy_1.VendorLoginStrategy,
        });
        tsyringe_1.container.register('AdminForgotPasswordStrategy', {
            useClass: admin_forgot_password_strategy_1.AdminForgotPasswordStrategy,
        });
        tsyringe_1.container.register('CustomerForgotPasswordStrategy', {
            useClass: customer_forgot_password_strategy_1.CustomerForgotPasswordStrategy,
        });
        tsyringe_1.container.register('VendorForgotPasswordStrategy', {
            useClass: vendor_forgot_password_strategy_1.VendorForgotPasswordStrategy,
        });
        tsyringe_1.container.register('ICustomerResetPasswordStrategy', {
            useClass: customer_reset_password_strategy_1.CustomerResetPasswordStrategy,
        });
        tsyringe_1.container.register('IVendorResetPasswordStrategy', {
            useClass: vendor_reset_password_strategy_1.VendorResetPasswordStrategy,
        });
        tsyringe_1.container.register('IAdminResetPasswordStrategy', {
            useClass: admin_reset_password_strategy_1.AdminResetPasswordStrategy,
        });
        tsyringe_1.container.register('IVendorProfileStrategy', {
            useClass: vendor_profile_strategy_1.VendorProfileStrategy,
        });
        tsyringe_1.container.register('ICustomerProfileStrategy', {
            useClass: customer_profile_strategy_1.CustomerProfileStrategy,
        });
        tsyringe_1.container.register('IVendorProfileUpdateStrategy', {
            useClass: vendor_profile_update_strategy_1.VendorProfileUpdateStrategy,
        });
        tsyringe_1.container.register('ICustomerProfileUpdateStrategy', {
            useClass: customer_profile_update_strategy_1.CustomerProfileUpdateStrategy,
        });
        tsyringe_1.container.register('IFetchingCustomersStrategy', {
            useClass: fetching_customers_strategy_1.FetchingCustomersStrategy,
        });
        tsyringe_1.container.register('IFetchingVendorsStrategy', {
            useClass: fetching_vendors_strategy_1.FetchingVendorsStrategy,
        });
        tsyringe_1.container.register('IChangeMyCustomersBlockStatusStrategy', {
            useClass: change_my_customers_block_status_strategy_1.ChangeMyCustomersBlockStatusStrategy,
        });
        tsyringe_1.container.register('IChangeMyVendorsBlockStatusStrategy', {
            useClass: change_my_vendors_block_status_strategy_1.ChangeMyVendorsBlockStatusStrategy,
        });
        tsyringe_1.container.register('IChangeAdminPasswordStrategy', {
            useClass: change_admin_password_strategy_1.ChangeAdminPasswordStrategy,
        });
        tsyringe_1.container.register('IChangeCustomerPasswordStrategy', {
            useClass: change_customer_password_strategy_1.ChangeCustomerPasswordStrategy,
        });
        tsyringe_1.container.register('IChangeVendorPasswordStrategy', {
            useClass: change_vendor_password_strategy_1.ChangeVendorPasswordStrategy,
        });
        tsyringe_1.container.register('ICustomerProfileImageUploadStrategy', {
            useClass: customer_profile_image_upload_strategy_1.CustomerProfileImageUploadStrategy,
        });
        tsyringe_1.container.register('IVendorProfileImageUploadStrategy', {
            useClass: vendor_profile_image_upload_strategy_1.VendorProfileImageUploadStrategy,
        });
        tsyringe_1.container.register('IGetBookingForAdminStrategyInterface', {
            useClass: get_booking_for_admin_strategy_1.GetBookingForAdminStrategy,
        });
        tsyringe_1.container.register('IGetBookingForVendorStrategyInterface', {
            useClass: get_booking_for_vendor_strategy_1.GetBookingForVendorStrategy,
        });
        tsyringe_1.container.register('IGetBookingForCustomerStrategyInterface', {
            useClass: get_booking_for_customer_strategy_1.GetBookingForCustomerStrategy,
        });
        tsyringe_1.container.register('ICustomerCancelBookingStrategyInterface', {
            useClass: customer_cancel_booking_strategy_1.CustomerCancelBookingStrategy,
        });
        tsyringe_1.container.register('IVendorCancelBookingStrategyInterface', {
            useClass: vendor_cancel_booking_strategy_1.VendorCancelBookingStrategy,
        });
        tsyringe_1.container.register('IGetBookingDetailsForCustomerStrategy', {
            useClass: get_booking_details_for_customer_strategy_1.GetBookingDetailsForCustomerStrategy,
        });
        tsyringe_1.container.register('IGetBookingDetailsForVendorStrategy', {
            useClass: get_booking_details_for_vendor_strategy_1.GetBookingDetailsForVendorStrategy,
        });
        tsyringe_1.container.register('IGetCustomerPaymentHistoryStrategy', {
            useClass: get_customer_payment_history_strategy_1.GetCustomerPaymentHistoryStrategy,
        });
        tsyringe_1.container.register('IGetVendorPaymentHistoryStrategy', {
            useClass: get_vendor_payment_history_strategy_1.GetVendorPaymentHistoryStrategy,
        });
        //mappers
        tsyringe_1.container.register('ICustomerSafeMapper', { useClass: customer_safe_user_mapper_1.CustomerSafeMapper });
        tsyringe_1.container.register('IVendorSafeMapper', { useClass: vendor_safe_user_mapper_1.VendorSafeMapper });
    }
}
exports.UseCaseRegistry = UseCaseRegistry;
