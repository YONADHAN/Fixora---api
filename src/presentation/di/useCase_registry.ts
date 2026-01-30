import { container } from 'tsyringe'
//service
import { IGetRatingAndReviewForServiceUseCase } from '../../domain/useCaseInterfaces/rating_review/get_rating_and_review_for_service_usecase.interface'
import { GetRatingAndReviewForServiceUseCase } from '../../application/usecase/rating_review/get_rating_and_review_for_service_usecase'
import { ICreateRatingsAndReviewsUseCase } from '../../domain/useCaseInterfaces/rating_review/create_ratings_and_reviews_usecase.interface'
import { CreateRatingsAndReviewsUseCase } from '../../application/usecase/rating_review/create_ratings_and_reviews_usecase'
import { IEditRatingsAndReviewsUseCase } from '../../domain/useCaseInterfaces/rating_review/edit_ratings_and_reviews_usecase.interface'
import { EditRatingsAndReviewsUseCase } from '../../application/usecase/rating_review/edit_ratings_and_reviews_usecase'
import { ISoftDeleteRatingsAndReviews } from '../../domain/useCaseInterfaces/rating_review/soft_delete_ratings_and_reviews_usecase.interface'
import { SoftDeleteRatingsAndReviewsUseCase } from '../../application/usecase/rating_review/soft_delete_ratings_and_reviews_usecase'
import { IGetRatingsAndReviewsForAllBookedServicesUseCase } from '../../domain/useCaseInterfaces/rating_review/get_ratings_and_reviews_for_all_booked_service_usecase.interface'
import { GetRatingsAndReviewsForAllBookedServicesUseCase } from '../../application/usecase/rating_review/get_ratings_and_reviews_for_all_booked_service_usecase'
import { ISoftDeleteRatingsAndReviewsFactory } from '../../application/factories/rating_review/soft_delete_ratings_review_factory.interface'
import { SoftDeleteRatingsAndReviewsFactory } from '../../application/factories/rating_review/soft_delete_ratings_review_factory'
import { ISoftDeleteRatingsAndReviewsByCustomerStrategy } from '../../application/strategies/rating_review/soft_delete_rating_review_by_customer_strategy.interface'
import { SoftDeleteRatingsAndReviewsByCustomerStrategy } from '../../application/strategies/rating_review/soft_delete_rating_review_by_customer_strategy'
import { ISoftDeleteRatingsAndReviewsByAdminStrategy } from '../../application/strategies/rating_review/soft_delete_rating_review_by_admin_strategy.interface'
import { SoftDeleteRatingsAndReviewsByAdminStrategy } from '../../application/strategies/rating_review/soft_delete_rating_review_by_admin_strategy'

import { EmailService } from '../../interfaceAdapters/services/email_service'
import { IEmailService } from '../../domain/serviceInterfaces/email_service_interface'
import { UserExistenceService } from '../../interfaceAdapters/services/user_existence.service'
import { IUserExistenceService } from '../../domain/serviceInterfaces/user_existence_service.interface'
import { OtpService } from '../../interfaceAdapters/services/otp_service'
import { IOtpService } from '../../domain/serviceInterfaces/otp_service_interface'
import { ITokenService } from '../../domain/serviceInterfaces/token_service_interface'
import { JWTService } from '../../interfaceAdapters/services/jwt_service'
import { IStorageService } from '../../domain/serviceInterfaces/s3_storage_service_interface'
import { S3StorageService } from '../../interfaceAdapters/services/s3_storage_service'
import { IBookingServices } from '../../domain/serviceInterfaces/booking_service_interface'
//security
import { IBcrypt } from '../security/bcrypt_interface'
import { OtpBcrypt } from '../security/otp_bcrypt'
import { PasswordBcrypt } from '../security/password_bcrypt'
//usecase
import { sendOtpEmailUseCase } from '../../application/usecase/auth/send_otp_email_useCase'
import { ISendOtpEmailUseCase } from '../../domain/useCaseInterfaces/auth/sent_otp_usecase_interface'
import { IVerifyOtpUseCase } from '../../domain/useCaseInterfaces/auth/verify_otp_usecase_interface'
import { VerifyOtpUseCase } from '../../application/usecase/auth/verify_otp_usecase'
import { IRegisterUserUseCase } from '../../domain/useCaseInterfaces/auth/register_usecase_interface'
import { RegisterUserUseCase } from '../../application/usecase/auth/register_user_usecase'
import { IGenerateTokenUseCase } from '../../domain/useCaseInterfaces/auth/generate_token_usecase_interface'
import { GenerateTokenUseCase } from '../../application/usecase/auth/generate_token_usecase'
import { ILoginUserUseCase } from '../../domain/useCaseInterfaces/auth/login_usecase_interface'
import { LoginUserUseCase } from '../../application/usecase/auth/login_user_usecase'

import { ICreateSubscriptionPlanUseCase } from '../../domain/useCaseInterfaces/subscription/create_subscription_plan_usecase.interface'
import { CreateSubscriptionPlanUseCase } from '../../application/usecase/subscription/create_subscription_plan_usecase'
import { IGetAllSubscriptionPlansUseCase } from '../../domain/useCaseInterfaces/subscription/get_all_subscription_plans_usecase.interface'
import { GetAllSubscriptionPlansUseCase } from '../../application/usecase/subscription/get_all_subscription_plans_usecase'
import { IUpdateSubscriptionPlanUseCase } from '../../domain/useCaseInterfaces/subscription/update_subscription_plan_usecase.interface'
import { UpdateSubscriptionPlanUseCase } from '../../application/usecase/subscription/update_subscription_plan_usecase'
import { IToggleSubscriptionPlanStatusUseCase } from '../../domain/useCaseInterfaces/subscription/toggle_subscription_plan_status_usecase.interface'
import { ToggleSubscriptionPlanStatusUseCase } from '../../application/usecase/subscription/toggle_subscription_plan_status_usecase'

import { IGetActiveSubscriptionPlansUseCase } from '../../domain/useCaseInterfaces/subscription/get_active_subscription_plans_usecase.interface'
import { GetActiveSubscriptionPlansUseCase } from '../../application/usecase/subscription/get_active_subscription_plans_usecase'
import { ICreateSubscriptionCheckoutUseCase } from '../../domain/useCaseInterfaces/subscription/create_subscription_checkout_usecase.interface'
import { CreateSubscriptionCheckoutUseCase } from '../../application/usecase/subscription/create_subscription_checkout_usecase'

import { ISubscriptionCheckoutCompletedUseCase } from '../../domain/useCaseInterfaces/subscription/webhook_usecase_interfaces_for_subscription/subscription_checkout_completed_usecase.interface'
import { SubscriptionCheckoutCompletedUseCase } from '../../application/usecase/subscription/webhook_usecases_for_subscription/subscription_checkout_completed_usecase'
import { ISubscriptionInvoiceFailedUseCase } from '../../domain/useCaseInterfaces/subscription/webhook_usecase_interfaces_for_subscription/subscription_invoice_failed_usecase.interface'
import { SubscriptionInvoiceFailedUseCase } from '../../application/usecase/subscription/webhook_usecases_for_subscription/subscription_invoice_failed_usecase'
import { ISubscriptionInvoicePaidUseCase } from '../../domain/useCaseInterfaces/subscription/webhook_usecase_interfaces_for_subscription/subscription_invoice_paid_usecase.interface'
import { SubscriptionInvoicePaidUseCase } from '../../application/usecase/subscription/webhook_usecases_for_subscription/subscription_invoice_paid_usecase'
import { ISubscriptionCancelledUseCase } from '../../domain/useCaseInterfaces/subscription/webhook_usecase_interfaces_for_subscription/subscription_cancelled_usecase.interface'
import { SubscriptionCancelledUseCase } from '../../application/usecase/subscription/webhook_usecases_for_subscription/subscription_cancelled_usecase'

import { ICreateSubscriptionCheckoutFactory } from '../../application/factories/subscription/create_subscription_checkout_factory.interface'
import { CreateSubscriptionCheckoutFactory } from '../../application/factories/subscription/create_subscription_checkout_factory'
import { ISubscriptionAccessStrategyFactory } from '../../application/factories/subscription/subscription_access_strategy_factory.interface'
import { SubscriptionAccessStrategyFactory } from '../../application/factories/subscription/subscription_access_strategy.factory'

import { ICreateVendorSubscriptionCheckoutStrategy } from '../../application/strategies/subscription/create_subscription_checkout_strategy.ts/create_vendor_subscription_checkout_strategy.interface'
import { CreateVendorSubscriptionCheckoutStrategy } from '../../application/strategies/subscription/create_subscription_checkout_strategy.ts/create_vendor_subscription_checkout_strategy'
import { IVendorEnsureActiveSubscriptionStrategy } from '../../application/strategies/subscription/subscription_access_strategy/vendor_subscription_access_strategy.interface'
import { VendorEnsureActiveSubscriptionStrategy } from '../../application/strategies/subscription/subscription_access_strategy/vendor_subscription_access_strategy'

import { IForgotPasswordUseCase } from '../../domain/useCaseInterfaces/auth/forgot_password_usecase_interface'
import { ForgotPasswordUseCase } from '../../application/usecase/auth/forgot_password_usecase'
import { IResetPasswordUseCase } from '../../domain/useCaseInterfaces/auth/reset_password_usecase_interface'
import { ResetPasswordUseCase } from '../../application/usecase/auth/reset_password_usecase'
import { IBlacklistTokenUseCase } from '../../domain/useCaseInterfaces/auth/blacklist_token_usecase_interface'
import { BlacklistTokenUseCase } from '../../application/usecase/auth/blacklist_token_usecase'
import { IRevokeRefreshTokenUseCase } from '../../domain/useCaseInterfaces/auth/revoke_refresh_token_usecase'
import { RevokeRefreshTokenUseCase } from '../../application/usecase/auth/revoke_refresh_token_usecase'
import { RefreshTokenUseCase } from '../../application/usecase/auth/refresh_token_usecase'
import { IRefreshTokenUseCase } from '../../domain/useCaseInterfaces/auth/refresh_token_usecase_interface'
import { IGetProfileInfoUseCase } from '../../domain/useCaseInterfaces/common/get_profile_info_usecase_interface'
import { GetProfileInfoUseCase } from '../../application/usecase/common/get_profile_info_usecase'
import { IProfileInfoUpdateUseCase } from '../../domain/useCaseInterfaces/common/profile_info_update_usecase_interface'
import { ProfileInfoUpdateUseCase } from '../../application/usecase/common/profile_info_update_usecase'
import { IGetAllUsersUseCase } from '../../domain/useCaseInterfaces/common/get_all_users_usecase_interface'
import { GetAllUsersUseCase } from '../../application/usecase/common/get_all_users_usecase'
import { IChangeMyUserBlockStatusUseCase } from '../../domain/useCaseInterfaces/admin/change_my_users_block_status_usecase_interface'
import { ChangeMyUserBlockStatusUseCase } from '../../application/usecase/admin/block-status/change_my_user_block_status_usecase'
import { IGoogleUseCase } from '../../domain/useCaseInterfaces/auth/google_usecase.interface'
import { GoogleLoginUseCase } from '../../application/usecase/auth/google_login_user_usecase'
import { IGoogleRegisterUserUseCase } from '../../domain/useCaseInterfaces/auth/google_register_user_usecase_interface'
import { GoogleRegisterUserUseCase } from '../../application/usecase/auth/google_register_user_usecase'
import { IUploadVendorDocsUseCase } from '../../domain/useCaseInterfaces/vendor/upload_vendor_docs_usecase.interface'
import { UploadVendorDocsUseCase } from '../../application/usecase/vendor/upload_vendor_docs.usecase'
import { IGetAllVendorRequestsUseCase } from '../../domain/useCaseInterfaces/admin/get_all_vendor_requests_usecase_interface'
import { GetAllVendorRequestsUseCase } from '../../application/usecase/admin/verification-requests/get_all_vendor_requests_usecase'
import { IChangeVendorVerificationStatusUseCase } from '../../domain/useCaseInterfaces/admin/change_vendor_verification_status_usecase_interface'
import { ChangeVendorVerificationStatusUseCase } from '../../application/usecase/admin/verification-requests/change_vendor_verification_status_usecase'
import { IChangeMyPasswordUseCase } from '../../domain/useCaseInterfaces/auth/change_my_password_usecase_interface'
import { ChangeMyPasswordUseCase } from '../../application/usecase/auth/change_my_password_usecase'
import { IGetAllServiceCategoryUseCase } from '../../domain/useCaseInterfaces/service_category/service_category_usecase.interface'
import { GetAllServiceCategoryUseCase } from '../../application/usecase/service_category/service_category_usecase'
import { ICreateServiceCategoryUseCase } from '../../domain/useCaseInterfaces/service_category/create_service_category_usecase.interface'
import { CreateServiceCategoryUseCase } from '../../application/usecase/service_category/create_service_category_usecase'
import { IEditServiceCategoryUseCase } from '../../domain/useCaseInterfaces/service_category/edit_service_category_usecase.interface'
import { EditServiceCategoryUseCase } from '../../application/usecase/service_category/edit_service_category_usecase'
import { IBlockServiceCategoryUseCase } from '../../domain/useCaseInterfaces/service_category/block_service_category_usecase.interface'
import { BlockServiceCategoryUseCase } from '../../application/usecase/service_category/block_service_category_usecase'
import { IGetSingleServiceCategoryUseCase } from '../../domain/useCaseInterfaces/service_category/single_service_category_usecase.interface'
import { GetSingleServiceCategoryUseCase } from '../../application/usecase/service_category/single_service_category_usecase'
import { IGetActiveServiceCategoriesUseCase } from '../../domain/useCaseInterfaces/service_category/active_service_category_usecase.interface'
import { GetActiveServiceCategoriesUseCase } from '../../application/usecase/service_category/active_service_categories_usecase'
import { ICreateSubServiceCategoryUseCase } from '../../domain/useCaseInterfaces/sub_service_category/create_sub_service_usecase.interface'
import { CreateSubServiceCategoryUseCase } from '../../application/usecase/sub_service_category/create_sub_service_category_usecase'
import { IEditSubServiceCategoryUseCase } from '../../domain/useCaseInterfaces/sub_service_category/edit_sub_service_category_usecase.interface'
import { EditSubServiceCategoryUseCase } from '../../application/usecase/sub_service_category/edit_sub_service_category_usecase'
import { IGetAllSubServiceCategoryUseCase } from '../../domain/useCaseInterfaces/sub_service_category/get_all_sub_service_category_usecase.interface'
import { GetAllSubServiceCategoryUseCase } from '../../application/usecase/sub_service_category/get_all_sub_service_category_usecase'
import { IGetSingleSubServiceCategoryUseCase } from '../../domain/useCaseInterfaces/sub_service_category/get_single_sub_service_category_usecase.interface'
import { GetSingleSubServiceCategoryUseCase } from '../../application/usecase/sub_service_category/get_single_sub_service_category_usecase'
import { IToggleBlockStatusOfSubServiceCategoryUseCase } from '../../domain/useCaseInterfaces/sub_service_category/toggle_block_status_of_sub_service_usecase.interface'
import { ToggleBlockStatusOfSubServiceCategoryUseCase } from '../../application/usecase/sub_service_category/toggle_block_status_of_sub_service_category_usecase'
import { IToggleVerificationStatusOfSubServiceCategoryUseCase } from '../../domain/useCaseInterfaces/sub_service_category/toggle_verification_status_of_sub_service_category_usecase.interface'
import { ToggleVerificationStatusOfSubServiceCategoryUseCase } from '../../application/usecase/sub_service_category/toggle_verification_status_of_sub_service_category_usecase'
import { ISearchServicesForCustomersUseCase } from '../../domain/useCaseInterfaces/service/search_services_for_customers_usecase.interface'
import { SearchServicesForCustomersUseCase } from '../../application/usecase/service/search_services_for_customers_usecase'
import { IGetAvailableSlotsForCustomerUseCase } from '../../domain/useCaseInterfaces/booking/get_available_slots_for_customer_usecase_interface'
import { GetAvailableSlotsForCustomerUseCase } from '../../application/usecase/booking/get_available_slots_for_customer_usecase'
import { ICreateBookingHoldUseCase } from '../../domain/useCaseInterfaces/booking_hold/create_booking_hold_usecase_interface'
import { CreateBookingHoldUseCase } from '../../application/usecase/booking_hold/create_booking_hold_usecase'
import { IGetBookingsUseCase } from '../../domain/useCaseInterfaces/booking/get_bookings_usecase_interface'
import { GetBookingsUseCase } from '../../application/usecase/booking/get_booking_usecase'
import { ICancelBookingUseCase } from '../../domain/useCaseInterfaces/booking/cancel_booking_usecase_interface'
import { CancelBookingUseCase } from '../../application/usecase/booking/cancel_booking_usecase'
//factory
import { RegistrationStrategyFactory } from '../../application/factories/auth/registration/registration_strategy_factory'
import { IRegistrationStrategyFactory } from '../../application/factories/auth/registration/registration_strategy_factory.interface'
import { LoginStrategyFactory } from '../../application/factories/auth/login/login_strategy_factory'
import { ILoginStrategyFactory } from '../../application/factories/auth/login/login_strategy_factory.interface'
import { ForgotPasswordStrategyFactory } from '../../application/factories/auth/forgot_password/forgot_password_strategy_factory'
import { IForgotPasswordStrategyFactory } from '../../application/factories/auth/forgot_password/forgot_password_strategy_factory.interface'
import { ResetPasswordStrategyFactory } from '../../application/factories/auth/reset_password/reset_password_strategy_factory'
import { IResetPasswordStrategyFactory } from '../../application/factories/auth/reset_password/reset_password_strategy_factory.interface'
import { IProfileFactory } from '../../application/factories/commonFeatures/profile/profile_factory.interface'
import { ProfileFactory } from '../../application/factories/commonFeatures/profile/profile_factory'
import { ProfileUpdateFactory } from '../../application/factories/commonFeatures/profile/profile_update_factory'
import { IProfileUpdateFactory } from '../../application/factories/commonFeatures/profile/profile_update_factory.interface'
import { IGetAllUsersFactory } from '../../application/factories/commonFeatures/users/get_all_users_factory.interface'
import { GetAllUsersFactory } from '../../application/factories/commonFeatures/users/get_all_users_factory'
import { IChangeMyUserBlockStatusFactory } from '../../application/factories/admin/block_status/change_my_user_block_status_factory.interface'
import { ChangeMyUserBlockStatusFactory } from '../../application/factories/admin/block_status/change_my_user_block_status_factory'
import { IGoogleRegistrationStrategyFactory } from '../../application/factories/auth/registration/google/google_registration_strategy_factory'
import { GoogleRegistrationStrategyFactory } from '../../application/factories/auth/registration/google/google_registration_strategy_factory'
import { IChangePasswordFactory } from '../../application/factories/auth/change_password/change_password_strategy_factory.interface'
import { ChangePasswordFactory } from '../../application/factories/auth/change_password/change_password_strategy_factory'
import { IProfileImageUploadFactory } from '../../application/factories/commonFeatures/profile/profile_image_upload_factory.interface'
import { ProfileImageUploadFactory } from '../../application/factories/commonFeatures/profile/profile_image_upload_factory'
import { IGetBookingsFactory } from '../../application/factories/booking/get_booking_factory.interface'
import { GetBookingsFactory } from '../../application/factories/booking/get_booking_factory'
import { ICancelBookingFactory } from '../../application/factories/booking/cancel_booking_factory.interface'
import { CancelBookingFactory } from '../../application/factories/booking/cancel_booking_factory'
import { PaymentHistoryFactory } from '../../application/factories/payment_history_factory/payment_history_factory'
import { IPaymentHistoryFactory } from '../../application/factories/payment_history_factory/payment_history_factory.interface'

//Mapper Factory
import { IUserMapperFactory } from '../../application/mappers/mapper_factories/user_mapper_factory'
import { UserMapperFactory } from '../../application/mappers/mapper_factories/user_mapper_factory.impl'

//Mapper
import { CustomerSafeMapper } from '../../application/mappers/customer/customer_safe_user_mapper'
import { VendorSafeMapper } from '../../application/mappers/vendor/vendor_safe_user_mapper'
//strategy
import { CustomerRegistrationStrategy } from '../../application/strategies/auth/registration/customer_registration_strategy'
import { ICustomerRegistrationStrategy } from '../../application/strategies/auth/registration/customer_registration_strategy.interface'
import { AdminRegistrationStrategy } from '../../application/strategies/auth/registration/admin_registration_strategy'
import { IAdminRegistrationStrategy } from '../../application/strategies/auth/registration/admin_registration_strategy.interface'
import { VendorRegistrationStrategy } from '../../application/strategies/auth/registration/vendor_registration_strategy'
import { IVendorRegistrationStrategy } from '../../application/strategies/auth/registration/vendor_registration_strategy.interface'
import { AdminLoginStrategy } from '../../application/strategies/auth/login/admin_login_strategy'
import { IAdminLoginStrategy } from '../../application/strategies/auth/login/admin_login_strategy.interface'
import { CustomerLoginStrategy } from '../../application/strategies/auth/login/customer_login_strategy'
import { ICustomerLoginStrategy } from '../../application/strategies/auth/login/customer_login_strategy.interface'
import { VendorLoginStrategy } from '../../application/strategies/auth/login/vendor_login_strategy'
import { IVendorLoginStrategy } from '../../application/strategies/auth/login/vendor_login_strategy.interface'
import { IAdminForgotPasswordStrategy } from '../../application/strategies/auth/forgot_password/admin_forgot_password_strategy.interface'
import { AdminForgotPasswordStrategy } from '../../application/strategies/auth/forgot_password/admin_forgot_password_strategy'
import { ICustomerForgotPasswordStrategy } from '../../application/strategies/auth/forgot_password/customer_forgot_password_strategy.interface'
import { CustomerForgotPasswordStrategy } from '../../application/strategies/auth/forgot_password/customer_forgot_password_strategy'
import { IVendorForgotPasswordStrategy } from '../../application/strategies/auth/forgot_password/vendor_forgot_password_strategy.interface'
import { VendorForgotPasswordStrategy } from '../../application/strategies/auth/forgot_password/vendor_forgot_password_strategy'
import { IAdminResetPasswordStrategy } from '../../application/strategies/auth/reset_password/admin_reset_password_strategy.interface'
import { AdminResetPasswordStrategy } from '../../application/strategies/auth/reset_password/admin_reset_password_strategy'
import { IVendorResetPasswordStrategy } from '../../application/strategies/auth/reset_password/vendor_reset_password_strategy.interface'
import { VendorResetPasswordStrategy } from '../../application/strategies/auth/reset_password/vendor_reset_password_strategy'
import { ICustomerResetPasswordStrategy } from '../../application/strategies/auth/reset_password/customer_reset_password_strategy.interface'
import { CustomerResetPasswordStrategy } from '../../application/strategies/auth/reset_password/customer_reset_password_strategy'

import { ICustomerProfileStrategy } from '../../application/strategies/commonFeatures/profile/customer_profile_strategy.interface'
import { CustomerProfileStrategy } from '../../application/strategies/commonFeatures/profile/customer_profile_strategy'
import { IVendorProfileStrategy } from '../../application/strategies/commonFeatures/profile/vendor_profile_strategy.interface'
import { VendorProfileStrategy } from '../../application/strategies/commonFeatures/profile/vendor_profile_strategy'

import { ICustomerProfileUpdateStrategy } from '../../application/strategies/commonFeatures/profile/customer_profile_update_strategy.interface'
import { CustomerProfileUpdateStrategy } from '../../application/strategies/commonFeatures/profile/customer_profile_update_strategy'
import { IVendorProfileUpdateStrategy } from '../../application/strategies/commonFeatures/profile/vendor_profile_update_strategy.interface'
import { VendorProfileUpdateStrategy } from '../../application/strategies/commonFeatures/profile/vendor_profile_update_strategy'

import { IFetchingCustomersStrategy } from '../../application/strategies/commonFeatures/users/fetching_customers_strategy.interface'
import { FetchingCustomersStrategy } from '../../application/strategies/commonFeatures/users/fetching_customers_strategy'
import { IFetchingVendorsStrategy } from '../../application/strategies/commonFeatures/users/fetching_vendors_strategy.interface'
import { FetchingVendorsStrategy } from '../../application/strategies/commonFeatures/users/fetching_vendors_strategy'

import { IChangeMyCustomersBlockStatusStrategy } from '../../application/strategies/commonFeatures/users/block_status/change_my_customers_block_status_strategy.interface'
import { ChangeMyCustomersBlockStatusStrategy } from '../../application/strategies/commonFeatures/users/block_status/change_my_customers_block_status_strategy'
import { IChangeMyVendorsBlockStatusStrategy } from '../../application/strategies/commonFeatures/users/block_status/change_my_vendors_block_status_strategy.interface'
import { ChangeMyVendorsBlockStatusStrategy } from '../../application/strategies/commonFeatures/users/block_status/change_my_vendors_block_status_strategy'

import { ICustomerGoogleRegistrationStrategy } from '../../application/strategies/auth/registration/google/customer_google_registration_strategy.interface'
import { CustomerGoogleRegistrationStrategy } from '../../application/strategies/auth/registration/google/customer_google_registration_strategy'
import { IVendorGoogleRegistrationStrategy } from '../../application/strategies/auth/registration/google/vendor_google_registration_strategy.interface'
import { VendorGoogleRegistrationStrategy } from '../../application/strategies/auth/registration/google/vendor_google_registration_strategy'
import { VendorStatusCheckUsecase } from '../../application/usecase/vendor/vendor_status_check_usecase'
import { IVendorStatusCheckUseCase } from '../../domain/useCaseInterfaces/vendor/vendor_status_check_usecase.interface'
import { IChangeAdminPasswordStrategy } from '../../application/strategies/auth/change_password/change_admin_password_strategy.interface'
import { ChangeAdminPasswordStrategy } from '../../application/strategies/auth/change_password/change_admin_password_strategy'
import { IChangeVendorPasswordStrategy } from '../../application/strategies/auth/change_password/change_vendor_password_strategy.interface'
import { ChangeVendorPasswordStrategy } from '../../application/strategies/auth/change_password/change_vendor_password_strategy'
import { IChangeCustomerPasswordStrategy } from '../../application/strategies/auth/change_password/change_customer_password_strategy.interface'
import { ChangeCustomerPasswordStrategy } from '../../application/strategies/auth/change_password/change_customer_password_strategy'

import { IGetCustomerPaymentHistoryStrategy } from '../../application/strategies/payment/get_payment_history/get_payment_history_strategy.interface'
import { GetCustomerPaymentHistoryStrategy } from '../../application/strategies/payment/get_payment_history/get_customer_payment_history_strategy'
import { IGetVendorPaymentHistoryStrategy } from '../../application/strategies/payment/get_payment_history/get_payment_history_strategy.interface'
import { GetVendorPaymentHistoryStrategy } from '../../application/strategies/payment/get_payment_history/get_vendor_payment_history_strategy'

import { ICustomerProfileImageUploadStrategy } from '../../application/strategies/commonFeatures/profile/image/customer_profile_image_upload_strategy.interface'
import { CustomerProfileImageUploadStrategy } from '../../application/strategies/commonFeatures/profile/image/customer_profile_image_upload_strategy'
import { IVendorProfileImageUploadStrategy } from '../../application/strategies/commonFeatures/profile/image/vendor_profile_image_upload_strategy.interface'
import { VendorProfileImageUploadStrategy } from '../../application/strategies/commonFeatures/profile/image/vendor_profile_image_upload_strategy'
import { IGetVendorSubServiceCategoriesUseCase } from '../../domain/useCaseInterfaces/sub_service_category/get_vendor_sub_service_categories_usecase.interface'
import { GetVendorSubServiceCategoriesUseCase } from '../../application/usecase/sub_service_category/get_vendor_sub_service_categories_usecase'
import { IGetAllSubServiceCategoriesBasedOnServiceCategoryIdUseCase } from '../../domain/useCaseInterfaces/sub_service_category/get_all_sub_service_categories_based_on_service_category_id_usecase.interface'
import { GetAllSubServiceCategoriesBasedOnServiceCategoryId } from '../../application/usecase/sub_service_category/get_all_sub_service_categories_based_on_service_category_id_usecase'
import { ICreateServiceUseCase } from '../../domain/useCaseInterfaces/service/create_service_category_usecase.interface'
import { CreateServiceUseCase } from '../../application/usecase/service/create_service_usecase'
import { IGetAllServicesUseCase } from '../../domain/useCaseInterfaces/service/get_all_services_usecase.interface'
import { GetAllServicesUseCase } from '../../application/usecase/service/get_all_service_usecase'
import { IGetServiceByIdUseCase } from '../../domain/useCaseInterfaces/service/get_service_by_id_usecase.interface'
import { GetServiceByIdUseCase } from '../../application/usecase/service/get_service_by_id_usecase'
import { IEditServiceUseCase } from '../../domain/useCaseInterfaces/service/edit_service_usecase.interface'
import { EditServiceUseCase } from '../../application/usecase/service/edit_service_usecase'
import { IToggleBlockServiceUseCase } from '../../domain/useCaseInterfaces/service/toggle_block_service_usecase.interface'
import { ToggleBlockServiceUseCase } from '../../application/usecase/service/toggle_block_service_usecase'
import { IGetActiveSubServiceCategoriesUseCase } from '../../domain/useCaseInterfaces/sub_service_category/get_active_sub_service_categories_usecase'
import { GetActiveSubServiceCategoriesUseCase } from '../../application/usecase/sub_service_category/get_active_sub_service_categories_usecase'
import { BookingServices } from '../../interfaceAdapters/services/booking_service'
import { ICreateStripePaymentIntentUseCase } from '../../domain/useCaseInterfaces/booking_hold/create_stripe_payment_intent_usecase_interface'
import { CreateStripePaymentIntentUseCase } from '../../application/usecase/booking_hold/create_stripe_payment_intent_usecase'
import { IStripePaymentSucceedUseCase } from '../../domain/useCaseInterfaces/booking_hold/stripe_payment_succeeded_usecase_interface'
import { StripePaymentSucceededUseCase } from '../../application/usecase/booking_hold/stripe_payment_succeeded_usecase'
import { IStripePaymentFailedUseCase } from '../../domain/useCaseInterfaces/booking_hold/stripe_payment_failed_usecase_interface'
import { StripePaymentFailedUseCase } from '../../application/usecase/booking_hold/stripe_payment_failed_usecase'
import { IGetBookingForAdminStrategyInterface } from '../../application/strategies/booking/get_bookings/get_booking_for_admin_strategy.interface'
import { GetBookingForAdminStrategy } from '../../application/strategies/booking/get_bookings/get_booking_for_admin_strategy'
import { IGetBookingForVendorStrategyInterface } from '../../application/strategies/booking/get_bookings/get_booking_for_vendor_strategy.interface'
import { GetBookingForVendorStrategy } from '../../application/strategies/booking/get_bookings/get_booking_for_vendor_strategy'
import { IGetBookingForCustomerStrategyInterface } from '../../application/strategies/booking/get_bookings/get_booking_for_customer_strategy.interface'
import { GetBookingForCustomerStrategy } from '../../application/strategies/booking/get_bookings/get_booking_for_customer_strategy'

import { ICustomerCancelBookingStrategyInterface } from '../../application/strategies/booking/cancel_bookings/customer_cancel_booking_strategy.interface'
import { CustomerCancelBookingStrategy } from '../../application/strategies/booking/cancel_bookings/customer_cancel_booking_strategy'
import { IVendorCancelBookingStrategyInterface } from '../../application/strategies/booking/cancel_bookings/vendor_cancel_booking_strategy.interface'
import { VendorCancelBookingStrategy } from '../../application/strategies/booking/cancel_bookings/vendor_cancel_booking_strategy'
import { IGetAddressUseCase } from '../../domain/useCaseInterfaces/address/get_address_usecase_interface'
import { GetAddressUseCase } from '../../application/usecase/address/get_address_usecase'
import { IEditAddressUseCase } from '../../domain/useCaseInterfaces/address/edit_address_usecase_interface'
import { EditAddressUseCase } from '../../application/usecase/address/edit_address_usecase'
import { IAddAddressUseCase } from '../../domain/useCaseInterfaces/address/add_address_usecase_interface'
import { AddAddressUseCase } from '../../application/usecase/address/add_address_usecase'
import { ISetDefaultAddressUseCase } from '../../domain/useCaseInterfaces/address/set_default_address_usecase_interface'
import { SetDefaultAddressUseCase } from '../../application/usecase/address/set_default_address_usecase'
import { IDeleteAddressUseCase } from '../../domain/useCaseInterfaces/address/delete_address_usecase_interface'
import { DeleteAddressUseCase } from '../../application/usecase/address/delete_address_usecase'
import { IGetSingleAddressUseCase } from '../../domain/useCaseInterfaces/address/get_single_address_usecase_interface'
import { GetSingleAddressUseCase } from '../../application/usecase/address/get_single_address_usecase'
import { IGetBookingDetailsUseCase } from '../../domain/useCaseInterfaces/booking/get_booking_details_usecase_interface'
import { GetBookingDetailsUseCase } from '../../application/usecase/booking/get_booking_details_usecase'
import { IGetBookingDetailsForCustomerStrategy } from '../../application/strategies/booking/get_booking_details/get_booking_details_for_customer_strategy.interface'
import { GetBookingDetailsForCustomerStrategy } from '../../application/strategies/booking/get_booking_details/get_booking_details_for_customer_strategy'
import { IGetBookingDetailsForVendorStrategy } from '../../application/strategies/booking/get_booking_details/get_booking_details_for_vendor_strategy.interface'
import { GetBookingDetailsForVendorStrategy } from '../../application/strategies/booking/get_booking_details/get_booking_details_for_vendor_strategy'
import { IGetBookingDetailsFactory } from '../../application/factories/booking/get_booking_details_factory.interface'
import { GetBookingDetailsFactory } from '../../application/factories/booking/get_booking_details_factory'
import { IGetWalletUseCase } from '../../domain/useCaseInterfaces/wallet/get_my_wallet_usecase_interface'
import { GetWalletUseCase } from '../../application/usecase/wallet/get_my_wallet_usecase'
import { ICreateNotificationUseCase } from '../../domain/useCaseInterfaces/notification/create_notification_usecase_interface'
import { CreateNotificationUseCase } from '../../application/usecase/notification/create_notification_usecase'
import { IGetMyNotificationsUseCase } from '../../domain/useCaseInterfaces/notification/get_my_notifications_usecase_interface'
import { GetMyNotificationsUseCase } from '../../application/usecase/notification/get_my_notifications_usecase'
import { IMarkAllNotificationsReadUseCase } from '../../domain/useCaseInterfaces/notification/mark_all_notifications_read_usecase.interface'
import { MarkAllNotificationsReadUseCase } from '../../application/usecase/notification/mark_all_notifications_read_usecase'
import { IMarkNotificationReadUseCase } from '../../domain/useCaseInterfaces/notification/mark_notification_read_usecase.interface'
import { MarkNotificationReadUseCase } from '../../application/usecase/notification/mark_notification_read_usecase'

import { IGetBookingByPaymentIdUseCase } from '../../domain/useCaseInterfaces/booking/get_booking_by_payment_id_usecase_interface'
import { GetBookingByPaymentIdUseCase } from '../../application/usecase/booking/get_booking_by_payment_id_usecase'

import { ISendMessageUseCase } from '../../domain/useCaseInterfaces/chat/send_message_usecase.interface'
import { SendMessageUseCase } from '../../application/usecase/chat/send_message_usecase'
import { IGetChatMessagesUseCase } from '../../domain/repositoryInterfaces/feature/chat/get_chat_messages_usecase.interface'
import { GetChatMessagesUseCase } from '../../application/usecase/chat/get_chat_messages_usecase'
import { IMarkChatReadUseCase } from '../../domain/useCaseInterfaces/chat/mark_chat_read_usecase.interface'
import { MarkChatReadUseCase } from '../../application/usecase/chat/mark_chat_read_usecase'
import { IInitiateChatUseCase } from '../../domain/useCaseInterfaces/chat/initiate_chat_usecase.interface'
import { InitiateChatUseCase } from '../../application/usecase/chat/initiate_chat_usecase'
import { IGetUserChatsUseCase } from '../../domain/useCaseInterfaces/chat/get_user_chats_usecase.interface'
import { GetUserChatsUseCase } from '../../application/usecase/chat/get_user_chats_usecase'

import { IGetVendorDashboardStatsUseCase } from '../../domain/useCaseInterfaces/dashboard/vendor/get_vendor_dashboard_status_usecase.interface'
import { GetVendorDashboardStatsUseCase } from '../../application/usecase/dashboard/vendor/get_vendor_dashboard_stats.usecase'
import { IGetAdminDashboardStatsUseCase } from '../../domain/useCaseInterfaces/dashboard/admin/get_admin_dashboard_stats_usecase.interface'
import { GetAdminDashboardStatsUseCase } from '../../application/usecase/dashboard/admin/get_admin_dashboard_stats.usecase'
import { SummaryAnalyticsUseCase } from '../../application/usecase/dashboard/analytics_usecases/summary_analytics_usecase'
import { ISummaryAnalyticsUseCase as ISummaryUseCase } from '../../domain/useCaseInterfaces/dashboard/analytics/summary_usecase.interface'

import { BookingAnalyticsUseCase } from '../../application/usecase/dashboard/analytics_usecases/booking_analytics_usecase'
import { IBookingAnalyticsUseCase } from '../../domain/useCaseInterfaces/dashboard/analytics/booking_analytics_usecase.interface'
import { CustomerAnalyticsUseCase } from '../../application/usecase/dashboard/analytics_usecases/customer_analytics_usecase'
import { ICustomerAnalyticsUseCase } from '../../domain/useCaseInterfaces/dashboard/analytics/customer_analytics_usecase.interface'
import { ServiceAnalyticsUseCase } from '../../application/usecase/dashboard/analytics_usecases/service_analytics_usecase'
import { IServiceAnalyticsUseCase } from '../../domain/useCaseInterfaces/dashboard/analytics/service_analytics_usecase.interface'
import { VendorAnalyticsUseCase } from '../../application/usecase/dashboard/analytics_usecases/vendor_analytics_usecase'
import { IVendorAnalyticsUseCase } from '../../domain/useCaseInterfaces/dashboard/analytics/vendor_analytics_usecase.interface'

import { SummaryAnalyticsFactory } from '../../application/factories/dashboard/SummaryAnalyticsFactory'
import { ISummaryAnalyticsFactory } from '../../application/factories/dashboard/ISummaryAnalyticsFactory'
import { BookingAnalyticsFactory } from '../../application/factories/dashboard/BookingAnalyticsFactory'
import { IBookingAnalyticsFactory } from '../../application/factories/dashboard/IBookingAnalyticsFactory'
import { CustomerAnalyticsFactory } from '../../application/factories/dashboard/CustomerAnalyticsFactory'
import { ICustomerAnalyticsFactory } from '../../application/factories/dashboard/ICustomerAnalyticsFactory'
import { ServiceAnalyticsFactory } from '../../application/factories/dashboard/ServiceAnalyticsFactory'
import { IServiceAnalyticsFactory } from '../../application/factories/dashboard/IServiceAnalyticsFactory'
import { VendorAnalyticsFactory } from '../../application/factories/dashboard/VendorAnalyticsFactory'
import { IVendorAnalyticsFactory } from '../../application/factories/dashboard/IVendorAnalyticsFactory'

import { SummaryAnalyticsStrategyForAdmin } from '../../application/strategies/dashboard/summary/SummaryAnalyticsStrategyForAdmin'
import { SummaryAnalyticsStrategyForVendor } from '../../application/strategies/dashboard/summary/SummaryAnalyticsStrategyForVendor'
import { ISummaryAnalyticsStrategy } from '../../application/strategies/dashboard/summary/ISummaryAnalyticsStrategy'
import { BookingAnalyticsStrategyForAdmin } from '../../application/strategies/dashboard/booking/BookingAnalyticsStrategyForAdmin'
import { BookingAnalyticsStrategyForVendor } from '../../application/strategies/dashboard/booking/BookingAnalyticsStrategyForVendor'
import { IBookingAnalyticsStrategy } from '../../application/strategies/dashboard/booking/IBookingAnalyticsStrategy'
import { CustomerAnalyticsStrategyForAdmin } from '../../application/strategies/dashboard/customer/CustomerAnalyticsStrategyForAdmin'
import { CustomerAnalyticsStrategyForVendor } from '../../application/strategies/dashboard/customer/CustomerAnalyticsStrategyForVendor'
import { ICustomerAnalyticsStrategy } from '../../application/strategies/dashboard/customer/ICustomerAnalyticsStrategy'
import { ServiceAnalyticsStrategyForAdmin } from '../../application/strategies/dashboard/service/ServiceAnalyticsStrategyForAdmin'
import { IServiceAnalyticsStrategy } from '../../application/strategies/dashboard/service/IServiceAnalyticsStrategy'
import { VendorAnalyticsStrategyForAdmin } from '../../application/strategies/dashboard/vendor/VendorAnalyticsStrategyForAdmin'
import { IVendorAnalyticsStrategy } from '../../application/strategies/dashboard/vendor/IVendorAnalyticsStrategy'

export class UseCaseRegistry {
  static registerUseCases(): void {
    container.register<IOtpService>('IOtpService', {
      useClass: OtpService,
    })
    container.register<ISendOtpEmailUseCase>('ISendOtpEmailUseCase', {
      useClass: sendOtpEmailUseCase,
    })

    container.register<IVerifyOtpUseCase>('IVerifyOtpUseCase', {
      useClass: VerifyOtpUseCase,
    })

    container.register<IRegisterUserUseCase>('IRegisterUserUseCase', {
      useClass: RegisterUserUseCase,
    })

    container.register<IGenerateTokenUseCase>('IGenerateTokenUseCase', {
      useClass: GenerateTokenUseCase,
    })

    container.register<ILoginUserUseCase>('ILoginUserUseCase', {
      useClass: LoginUserUseCase,
    })

    container.register<IForgotPasswordUseCase>('IForgotPasswordUseCase', {
      useClass: ForgotPasswordUseCase,
    })

    container.register<IResetPasswordUseCase>('IResetPasswordUseCase', {
      useClass: ResetPasswordUseCase,
    })
    container.register<IBlacklistTokenUseCase>('IBlacklistTokenUseCase', {
      useClass: BlacklistTokenUseCase,
    })
    container.register<IRevokeRefreshTokenUseCase>(
      'IRevokeRefreshTokenUseCase',
      {
        useClass: RevokeRefreshTokenUseCase,
      },
    )

    container.register<IRefreshTokenUseCase>('IRefreshTokenUseCase', {
      useClass: RefreshTokenUseCase,
    })

    container.register<IGetProfileInfoUseCase>('IGetProfileInfoUseCase', {
      useClass: GetProfileInfoUseCase,
    })

    container.register<IProfileInfoUpdateUseCase>('IProfileInfoUpdateUseCase', {
      useClass: ProfileInfoUpdateUseCase,
    })

    container.register<IGetAllUsersUseCase>('IGetAllUsersUseCase', {
      useClass: GetAllUsersUseCase,
    })

    container.register<IChangeMyUserBlockStatusUseCase>(
      'IChangeMyUserBlockStatusUseCase',
      {
        useClass: ChangeMyUserBlockStatusUseCase,
      },
    )

    container.register<IGoogleUseCase>('IGoogleUseCase', {
      useClass: GoogleLoginUseCase,
    })

    container.register<IVendorStatusCheckUseCase>('IVendorStatusCheckUseCase', {
      useClass: VendorStatusCheckUsecase,
    })
    container.register<IChangeVendorVerificationStatusUseCase>(
      'IChangeVendorVerificationStatusUseCase',
      {
        useClass: ChangeVendorVerificationStatusUseCase,
      },
    )
    container.register<IChangeMyPasswordUseCase>('IChangeMyPasswordUseCase', {
      useClass: ChangeMyPasswordUseCase,
    })

    container.register<ICreateServiceCategoryUseCase>(
      'ICreateServiceCategoryUseCase',
      {
        useClass: CreateServiceCategoryUseCase,
      },
    )

    container.register<IGetAllServiceCategoryUseCase>(
      'IGetAllServiceCategoryUseCase',
      {
        useClass: GetAllServiceCategoryUseCase,
      },
    )

    container.register<IEditServiceCategoryUseCase>(
      'IEditServiceCategoryUseCase',
      {
        useClass: EditServiceCategoryUseCase,
      },
    )

    container.register<IBlockServiceCategoryUseCase>(
      'IBlockServiceCategoryUseCase',
      {
        useClass: BlockServiceCategoryUseCase,
      },
    )

    container.register<IGetSingleServiceCategoryUseCase>(
      'IGetSingleServiceCategoryUseCase',
      {
        useClass: GetSingleServiceCategoryUseCase,
      },
    )
    container.register<IToggleVerificationStatusOfSubServiceCategoryUseCase>(
      'IToggleVerificationStatusOfSubServiceCategoryUseCase',
      {
        useClass: ToggleVerificationStatusOfSubServiceCategoryUseCase,
      },
    )

    container.register<ICreateServiceUseCase>('ICreateServiceUseCase', {
      useClass: CreateServiceUseCase,
    })

    container.register<IGetAllServicesUseCase>('IGetAllServicesUseCase', {
      useClass: GetAllServicesUseCase,
    })
    container.register<IGetServiceByIdUseCase>('IGetServiceByIdUseCase', {
      useClass: GetServiceByIdUseCase,
    })
    container.register<IEditServiceUseCase>('IEditServiceUseCase', {
      useClass: EditServiceUseCase,
    })
    container.register<IToggleBlockServiceUseCase>(
      'IToggleBlockServiceUseCase',
      {
        useClass: ToggleBlockServiceUseCase,
      },
    )
    container.register<ISearchServicesForCustomersUseCase>(
      'ISearchServicesForCustomersUseCase',
      {
        useClass: SearchServicesForCustomersUseCase,
      },
    )
    container.register<IGetAvailableSlotsForCustomerUseCase>(
      'IGetAvailableSlotsForCustomerUseCase',
      {
        useClass: GetAvailableSlotsForCustomerUseCase,
      },
    )

    container.register<ICreateBookingHoldUseCase>('ICreateBookingHoldUseCase', {
      useClass: CreateBookingHoldUseCase,
    })

    container.register<ICreateStripePaymentIntentUseCase>(
      'ICreateStripePaymentIntentUseCase',
      {
        useClass: CreateStripePaymentIntentUseCase,
      },
    )

    container.register<IGetBookingsUseCase>('IGetBookingsUseCase', {
      useClass: GetBookingsUseCase,
    })

    container.register<ICancelBookingUseCase>('ICancelBookingUseCase', {
      useClass: CancelBookingUseCase,
    })

    container.register<IGetBookingDetailsUseCase>('IGetBookingDetailsUseCase', {
      useClass: GetBookingDetailsUseCase,
    })

    container.register<IGetWalletUseCase>('IGetWalletUseCase', {
      useClass: GetWalletUseCase,
    })

    //security
    container.register<IBcrypt>('IPasswordBcrypt', {
      useClass: PasswordBcrypt,
    })

    container.register<IBcrypt>('IOtpBcrypt', {
      useClass: OtpBcrypt,
    })

    container.register<IGoogleRegisterUserUseCase>(
      'IGoogleRegisterUserUseCase',
      {
        useClass: GoogleRegisterUserUseCase,
      },
    )

    container.register<IUploadVendorDocsUseCase>('IUploadVendorDocsUseCase', {
      useClass: UploadVendorDocsUseCase,
    })

    container.register<IGetAllVendorRequestsUseCase>(
      'IGetAllVendorRequestsUseCase',
      {
        useClass: GetAllVendorRequestsUseCase,
      },
    )

    container.register<IGetActiveServiceCategoriesUseCase>(
      'IGetActiveServiceCategoriesUseCase',
      {
        useClass: GetActiveServiceCategoriesUseCase,
      },
    )
    container.register<ICreateSubServiceCategoryUseCase>(
      'ICreateSubServiceCategoryUseCase',
      {
        useClass: CreateSubServiceCategoryUseCase,
      },
    )
    container.register<IEditSubServiceCategoryUseCase>(
      'IEditSubServiceCategoryUseCase',
      {
        useClass: EditSubServiceCategoryUseCase,
      },
    )
    container.register<IGetAllSubServiceCategoryUseCase>(
      'IGetAllSubServiceCategoryUseCase',
      {
        useClass: GetAllSubServiceCategoryUseCase,
      },
    )
    container.register<IGetSingleSubServiceCategoryUseCase>(
      'IGetSingleSubServiceCategoryUseCase',
      {
        useClass: GetSingleSubServiceCategoryUseCase,
      },
    )
    container.register<IToggleBlockStatusOfSubServiceCategoryUseCase>(
      'IToggleBlockStatusOfSubServiceCategoryUseCase',
      {
        useClass: ToggleBlockStatusOfSubServiceCategoryUseCase,
      },
    )
    container.register<IGetVendorSubServiceCategoriesUseCase>(
      'IGetVendorSubServiceCategoriesUseCase',
      {
        useClass: GetVendorSubServiceCategoriesUseCase,
      },
    )

    container.register<IGetActiveSubServiceCategoriesUseCase>(
      'IGetActiveSubServiceCategoriesUseCase',
      {
        useClass: GetActiveSubServiceCategoriesUseCase,
      },
    )

    container.register<IGetAllSubServiceCategoriesBasedOnServiceCategoryIdUseCase>(
      'IGetAllSubServiceCategoriesBasedOnServiceCategoryIdUseCase',
      {
        useClass: GetAllSubServiceCategoriesBasedOnServiceCategoryId,
      },
    )

    container.register<IStripePaymentSucceedUseCase>(
      'IStripePaymentSucceedUseCase',
      {
        useClass: StripePaymentSucceededUseCase,
      },
    )

    container.register<IStripePaymentFailedUseCase>(
      'IStripePaymentFailedUseCase',
      {
        useClass: StripePaymentFailedUseCase,
      },
    )

    container.register<IGetAddressUseCase>('IGetAddressUseCase', {
      useClass: GetAddressUseCase,
    })

    container.register<IEditAddressUseCase>('IEditAddressUseCase', {
      useClass: EditAddressUseCase,
    })

    container.register<IAddAddressUseCase>('IAddAddressUseCase', {
      useClass: AddAddressUseCase,
    })

    container.register<ISetDefaultAddressUseCase>('ISetDefaultAddressUseCase', {
      useClass: SetDefaultAddressUseCase,
    })

    container.register<IDeleteAddressUseCase>('IDeleteAddressUseCase', {
      useClass: DeleteAddressUseCase,
    })

    container.register<IGetSingleAddressUseCase>('IGetSingleAddressUseCase', {
      useClass: GetSingleAddressUseCase,
    })
    container.register<ICreateNotificationUseCase>(
      'ICreateNotificationUseCase',
      {
        useClass: CreateNotificationUseCase,
      },
    )
    container.register<IGetMyNotificationsUseCase>(
      'IGetMyNotificationsUseCase',
      {
        useClass: GetMyNotificationsUseCase,
      },
    )
    container.register<IMarkAllNotificationsReadUseCase>(
      'IMarkAllNotificationsReadUseCase',
      {
        useClass: MarkAllNotificationsReadUseCase,
      },
    )
    container.register<IMarkNotificationReadUseCase>(
      'IMarkNotificationReadUseCase',
      {
        useClass: MarkNotificationReadUseCase,
      },
    )

    container.register<ISendMessageUseCase>('ISendMessageUseCase', {
      useClass: SendMessageUseCase,
    })

    container.register<IGetBookingByPaymentIdUseCase>(
      'IGetBookingByPaymentIdUseCase',
      {
        useClass: GetBookingByPaymentIdUseCase,
      },
    )

    container.register<IGetChatMessagesUseCase>('IGetChatMessagesUseCase', {
      useClass: GetChatMessagesUseCase,
    })

    container.register<IMarkChatReadUseCase>('IMarkChatReadUseCase', {
      useClass: MarkChatReadUseCase,
    })
    container.register<IInitiateChatUseCase>('IInitiateChatUseCase', {
      useClass: InitiateChatUseCase,
    })
    container.register<IGetUserChatsUseCase>('IGetUserChatsUseCase', {
      useClass: GetUserChatsUseCase,
    })

    container.register<IGetVendorDashboardStatsUseCase>(
      'IGetVendorDashboardStatsUseCase',
      {
        useClass: GetVendorDashboardStatsUseCase,
      },
    )

    container.register<IGetAdminDashboardStatsUseCase>(
      'IGetAdminDashboardStatsUseCase',
      {
        useClass: GetAdminDashboardStatsUseCase,
      },
    )

    //dashboard analytics usecases
    container.register<ISummaryUseCase>('ISummaryAnalyticsUseCase', {
      useClass: SummaryAnalyticsUseCase,
    })

    container.register<ICreateSubscriptionPlanUseCase>(
      'ICreateSubscriptionPlanUseCase',
      {
        useClass: CreateSubscriptionPlanUseCase,
      },
    )

    container.register<IGetAllSubscriptionPlansUseCase>(
      'IGetAllSubscriptionPlansUseCase',
      {
        useClass: GetAllSubscriptionPlansUseCase,
      },
    )

    container.register<IUpdateSubscriptionPlanUseCase>(
      'IUpdateSubscriptionPlanUseCase',
      {
        useClass: UpdateSubscriptionPlanUseCase,
      },
    )

    container.register<IToggleSubscriptionPlanStatusUseCase>(
      'IToggleSubscriptionPlanStatusUseCase',
      {
        useClass: ToggleSubscriptionPlanStatusUseCase,
      },
    )

    container.register<IGetActiveSubscriptionPlansUseCase>(
      'IGetActiveSubscriptionPlansUseCase',
      {
        useClass: GetActiveSubscriptionPlansUseCase,
      },
    )

    container.register<ICreateSubscriptionCheckoutUseCase>(
      'ICreateSubscriptionCheckoutUseCase',
      {
        useClass: CreateSubscriptionCheckoutUseCase,
      },
    )

    container.register<ISubscriptionCheckoutCompletedUseCase>(
      'ISubscriptionCheckoutCompletedUseCase',
      {
        useClass: SubscriptionCheckoutCompletedUseCase,
      },
    )

    container.register<ISubscriptionInvoiceFailedUseCase>(
      'ISubscriptionInvoiceFailedUseCase',
      {
        useClass: SubscriptionInvoiceFailedUseCase,
      },
    )

    container.register<ISubscriptionInvoicePaidUseCase>(
      'ISubscriptionInvoicePaidUseCase',
      {
        useClass: SubscriptionInvoicePaidUseCase,
      },
    )

    container.register<ISubscriptionCancelledUseCase>(
      'ISubscriptionCancelledUseCase',
      {
        useClass: SubscriptionCancelledUseCase,
      },
    )
    //service
    container.register<IUserExistenceService>('IUserExistenceService', {
      useClass: UserExistenceService,
    })

    container.register<IEmailService>('IEmailService', {
      useClass: EmailService,
    })

    container.register<ITokenService>('ITokenService', {
      useClass: JWTService,
    })
    container.register<IStorageService>('IStorageService', {
      useClass: S3StorageService,
    })

    container.register<ICustomerGoogleRegistrationStrategy>(
      'ICustomerGoogleRegistrationStrategy',
      {
        useClass: CustomerGoogleRegistrationStrategy,
      },
    )

    container.register<IVendorGoogleRegistrationStrategy>(
      'IVendorGoogleRegistrationStrategy',
      {
        useClass: VendorGoogleRegistrationStrategy,
      },
    )
    container.register<IBookingServices>('IBookingServices', {
      useClass: BookingServices,
    })
    //factory
    container.register<IRegistrationStrategyFactory>(
      'IRegistrationStrategyFactory',
      {
        useClass: RegistrationStrategyFactory,
      },
    )

    container.register<ILoginStrategyFactory>('ILoginStrategyFactory', {
      useClass: LoginStrategyFactory,
    })

    container.register<IForgotPasswordStrategyFactory>(
      'IForgotPasswordStrategyFactory',
      {
        useClass: ForgotPasswordStrategyFactory,
      },
    )

    container.register<IResetPasswordStrategyFactory>(
      'IResetPasswordStrategyFactory',
      {
        useClass: ResetPasswordStrategyFactory,
      },
    )

    container.register<IProfileFactory>('IProfileFactory', {
      useClass: ProfileFactory,
    })

    container.register<IProfileUpdateFactory>('IProfileUpdateFactory', {
      useClass: ProfileUpdateFactory,
    })
    container.register<IGetAllUsersFactory>('IGetAllUsersFactory', {
      useClass: GetAllUsersFactory,
    })

    container.register<IChangeMyUserBlockStatusFactory>(
      'IChangeMyUserBlockStatusFactory',
      {
        useClass: ChangeMyUserBlockStatusFactory,
      },
    )

    container.register<IGoogleRegistrationStrategyFactory>(
      'IGoogleRegistrationStrategyFactory',
      {
        useClass: GoogleRegistrationStrategyFactory,
      },
    )

    container.register<IUserMapperFactory>('IUserMapperFactory', {
      useClass: UserMapperFactory,
    })

    container.register<IChangePasswordFactory>('IChangePasswordFactory', {
      useClass: ChangePasswordFactory,
    })

    container.register<IProfileImageUploadFactory>(
      'IProfileImageUploadFactory',
      {
        useClass: ProfileImageUploadFactory,
      },
    )
    container.register<IGetBookingsFactory>('IGetBookingsFactory', {
      useClass: GetBookingsFactory,
    })

    container.register<ICancelBookingFactory>('ICancelBookingFactory', {
      useClass: CancelBookingFactory,
    })

    container.register<IGetBookingDetailsFactory>('IGetBookingDetailsFactory', {
      useClass: GetBookingDetailsFactory,
    })

    container.register<IPaymentHistoryFactory>('IPaymentHistoryFactory', {
      useClass: PaymentHistoryFactory,
    })

    container.register<ICreateSubscriptionCheckoutFactory>(
      'ICreateSubscriptionCheckoutFactory',
      {
        useClass: CreateSubscriptionCheckoutFactory,
      },
    )

    container.register<ISubscriptionAccessStrategyFactory>(
      'ISubscriptionAccessStrategyFactory',
      {
        useClass: SubscriptionAccessStrategyFactory,
      },
    )
    //strategy
    container.register<ICustomerRegistrationStrategy>(
      'ICustomerRegistrationStrategy',
      {
        useClass: CustomerRegistrationStrategy,
      },
    )
    container.register<IAdminRegistrationStrategy>(
      'IAdminRegistrationStrategy',
      {
        useClass: AdminRegistrationStrategy,
      },
    )
    container.register<IVendorRegistrationStrategy>(
      'IVendorRegistrationStrategy',
      {
        useClass: VendorRegistrationStrategy,
      },
    )

    container.register<IAdminLoginStrategy>('IAdminLoginStrategy', {
      useClass: AdminLoginStrategy,
    })

    container.register<ICustomerLoginStrategy>('ICustomerLoginStrategy', {
      useClass: CustomerLoginStrategy,
    })

    container.register<IVendorLoginStrategy>('IVendorLoginStrategy', {
      useClass: VendorLoginStrategy,
    })

    container.register<IAdminForgotPasswordStrategy>(
      'AdminForgotPasswordStrategy',
      {
        useClass: AdminForgotPasswordStrategy,
      },
    )

    container.register<ICustomerForgotPasswordStrategy>(
      'CustomerForgotPasswordStrategy',
      {
        useClass: CustomerForgotPasswordStrategy,
      },
    )

    container.register<IVendorForgotPasswordStrategy>(
      'VendorForgotPasswordStrategy',
      {
        useClass: VendorForgotPasswordStrategy,
      },
    )

    container.register<ICustomerResetPasswordStrategy>(
      'ICustomerResetPasswordStrategy',
      {
        useClass: CustomerResetPasswordStrategy,
      },
    )
    container.register<IVendorResetPasswordStrategy>(
      'IVendorResetPasswordStrategy',
      {
        useClass: VendorResetPasswordStrategy,
      },
    )
    container.register<IAdminResetPasswordStrategy>(
      'IAdminResetPasswordStrategy',
      {
        useClass: AdminResetPasswordStrategy,
      },
    )

    container.register<IVendorProfileStrategy>('IVendorProfileStrategy', {
      useClass: VendorProfileStrategy,
    })

    container.register<ICustomerProfileStrategy>('ICustomerProfileStrategy', {
      useClass: CustomerProfileStrategy,
    })

    container.register<IVendorProfileUpdateStrategy>(
      'IVendorProfileUpdateStrategy',
      {
        useClass: VendorProfileUpdateStrategy,
      },
    )

    container.register<ICustomerProfileUpdateStrategy>(
      'ICustomerProfileUpdateStrategy',
      {
        useClass: CustomerProfileUpdateStrategy,
      },
    )

    container.register<IFetchingCustomersStrategy>(
      'IFetchingCustomersStrategy',
      {
        useClass: FetchingCustomersStrategy,
      },
    )

    container.register<IFetchingVendorsStrategy>('IFetchingVendorsStrategy', {
      useClass: FetchingVendorsStrategy,
    })

    container.register<IChangeMyCustomersBlockStatusStrategy>(
      'IChangeMyCustomersBlockStatusStrategy',
      {
        useClass: ChangeMyCustomersBlockStatusStrategy,
      },
    )

    container.register<IChangeMyVendorsBlockStatusStrategy>(
      'IChangeMyVendorsBlockStatusStrategy',
      {
        useClass: ChangeMyVendorsBlockStatusStrategy,
      },
    )

    container.register<IChangeAdminPasswordStrategy>(
      'IChangeAdminPasswordStrategy',
      {
        useClass: ChangeAdminPasswordStrategy,
      },
    )

    container.register<IChangeCustomerPasswordStrategy>(
      'IChangeCustomerPasswordStrategy',
      {
        useClass: ChangeCustomerPasswordStrategy,
      },
    )

    container.register<IChangeVendorPasswordStrategy>(
      'IChangeVendorPasswordStrategy',
      {
        useClass: ChangeVendorPasswordStrategy,
      },
    )

    container.register<ICustomerProfileImageUploadStrategy>(
      'ICustomerProfileImageUploadStrategy',
      {
        useClass: CustomerProfileImageUploadStrategy,
      },
    )
    container.register<IVendorProfileImageUploadStrategy>(
      'IVendorProfileImageUploadStrategy',
      {
        useClass: VendorProfileImageUploadStrategy,
      },
    )

    container.register<IGetBookingForAdminStrategyInterface>(
      'IGetBookingForAdminStrategyInterface',
      {
        useClass: GetBookingForAdminStrategy,
      },
    )
    container.register<IGetBookingForVendorStrategyInterface>(
      'IGetBookingForVendorStrategyInterface',
      {
        useClass: GetBookingForVendorStrategy,
      },
    )
    container.register<IGetBookingForCustomerStrategyInterface>(
      'IGetBookingForCustomerStrategyInterface',
      {
        useClass: GetBookingForCustomerStrategy,
      },
    )

    container.register<ICustomerCancelBookingStrategyInterface>(
      'ICustomerCancelBookingStrategyInterface',
      {
        useClass: CustomerCancelBookingStrategy,
      },
    )

    container.register<IVendorCancelBookingStrategyInterface>(
      'IVendorCancelBookingStrategyInterface',
      {
        useClass: VendorCancelBookingStrategy,
      },
    )

    container.register<IGetBookingDetailsForCustomerStrategy>(
      'IGetBookingDetailsForCustomerStrategy',
      {
        useClass: GetBookingDetailsForCustomerStrategy,
      },
    )

    container.register<IGetBookingDetailsForVendorStrategy>(
      'IGetBookingDetailsForVendorStrategy',
      {
        useClass: GetBookingDetailsForVendorStrategy,
      },
    )

    container.register<IGetCustomerPaymentHistoryStrategy>(
      'IGetCustomerPaymentHistoryStrategy',
      {
        useClass: GetCustomerPaymentHistoryStrategy,
      },
    )

    container.register<IGetVendorPaymentHistoryStrategy>(
      'IGetVendorPaymentHistoryStrategy',
      {
        useClass: GetVendorPaymentHistoryStrategy,
      },
    )

    container.register<ICreateVendorSubscriptionCheckoutStrategy>(
      'ICreateVendorSubscriptionCheckoutStrategy',
      {
        useClass: CreateVendorSubscriptionCheckoutStrategy,
      },
    )

    container.register<IVendorEnsureActiveSubscriptionStrategy>(
      'IVendorEnsureActiveSubscriptionStrategy',
      {
        useClass: VendorEnsureActiveSubscriptionStrategy,
      },
    )

    //mappers
    container.register('ICustomerSafeMapper', { useClass: CustomerSafeMapper })
    container.register('IVendorSafeMapper', { useClass: VendorSafeMapper })

    // Dashboard Factories
    container.register<ISummaryAnalyticsFactory>('ISummaryAnalyticsFactory', {
      useClass: SummaryAnalyticsFactory,
    })
    container.register<IBookingAnalyticsFactory>('IBookingAnalyticsFactory', {
      useClass: BookingAnalyticsFactory,
    })
    container.register<ICustomerAnalyticsFactory>('ICustomerAnalyticsFactory', {
      useClass: CustomerAnalyticsFactory,
    })
    container.register<IServiceAnalyticsFactory>('IServiceAnalyticsFactory', {
      useClass: ServiceAnalyticsFactory,
    })
    container.register<IVendorAnalyticsFactory>('IVendorAnalyticsFactory', {
      useClass: VendorAnalyticsFactory,
    })

    // Dashboard Strategies
    container.register<ISummaryAnalyticsStrategy>(
      'SummaryAnalyticsStrategyForAdmin',
      { useClass: SummaryAnalyticsStrategyForAdmin },
    )
    container.register<ISummaryAnalyticsStrategy>(
      'SummaryAnalyticsStrategyForVendor',
      { useClass: SummaryAnalyticsStrategyForVendor },
    )
    container.register<IBookingAnalyticsStrategy>(
      'BookingAnalyticsStrategyForAdmin',
      { useClass: BookingAnalyticsStrategyForAdmin },
    )
    container.register<IBookingAnalyticsStrategy>(
      'BookingAnalyticsStrategyForVendor',
      { useClass: BookingAnalyticsStrategyForVendor },
    )
    container.register<ICustomerAnalyticsStrategy>(
      'CustomerAnalyticsStrategyForAdmin',
      { useClass: CustomerAnalyticsStrategyForAdmin },
    )
    container.register<ICustomerAnalyticsStrategy>(
      'CustomerAnalyticsStrategyForVendor',
      { useClass: CustomerAnalyticsStrategyForVendor },
    )
    container.register<IServiceAnalyticsStrategy>(
      'ServiceAnalyticsStrategyForAdmin',
      { useClass: ServiceAnalyticsStrategyForAdmin },
    )
    container.register<IVendorAnalyticsStrategy>(
      'VendorAnalyticsStrategyForAdmin',
      { useClass: VendorAnalyticsStrategyForAdmin },
    )

    // Dashboard UseCases
    container.register<IBookingAnalyticsUseCase>('IBookingAnalyticsUseCase', {
      useClass: BookingAnalyticsUseCase,
    })
    container.register<ICustomerAnalyticsUseCase>('ICustomerAnalyticsUseCase', {
      useClass: CustomerAnalyticsUseCase,
    })
    container.register<IServiceAnalyticsUseCase>('IServiceAnalyticsUseCase', {
      useClass: ServiceAnalyticsUseCase,
    })
    container.register<IVendorAnalyticsUseCase>('IVendorAnalyticsUseCase', {
      useClass: VendorAnalyticsUseCase,
    })

    // Rating and Review
    container.register<IGetRatingAndReviewForServiceUseCase>(
      'IGetRatingAndReviewForServiceUseCase',
      { useClass: GetRatingAndReviewForServiceUseCase },
    )
    container.register<ICreateRatingsAndReviewsUseCase>(
      'ICreateRatingsAndReviewsUseCase',
      { useClass: CreateRatingsAndReviewsUseCase },
    )
    container.register<IEditRatingsAndReviewsUseCase>(
      'IEditRatingsAndReviewsUseCase',
      { useClass: EditRatingsAndReviewsUseCase },
    )
    container.register<ISoftDeleteRatingsAndReviews>(
      'ISoftDeleteRatingsAndReviews',
      { useClass: SoftDeleteRatingsAndReviewsUseCase },
    )
    container.register<IGetRatingsAndReviewsForAllBookedServicesUseCase>(
      'IGetRatingsAndReviewsForAllBookedServicesUseCase',
      { useClass: GetRatingsAndReviewsForAllBookedServicesUseCase },
    )

    // Rating Review Factory
    container.register<ISoftDeleteRatingsAndReviewsFactory>(
      'ISoftDeleteRatingsAndReviewsFactory',
      { useClass: SoftDeleteRatingsAndReviewsFactory },
    )

    // Rating Review Strategies
    container.register<ISoftDeleteRatingsAndReviewsByCustomerStrategy>(
      'ISoftDeleteRatingsAndReviewsByCustomerStrategy',
      { useClass: SoftDeleteRatingsAndReviewsByCustomerStrategy },
    )
    container.register<ISoftDeleteRatingsAndReviewsByAdminStrategy>(
      'ISoftDeleteRatingsAndReviewsByAdminStrategy',
      { useClass: SoftDeleteRatingsAndReviewsByAdminStrategy },
    )
  }
}
