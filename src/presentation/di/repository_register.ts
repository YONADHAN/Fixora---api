import { container } from 'tsyringe'
import { OtpRepository } from '../../interfaceAdapters/repositories/auth/otp_repository'
import { CustomerRepository } from '../../interfaceAdapters/repositories/users/customer_repository'
import { AdminRepository } from '../../interfaceAdapters/repositories/users/admin_repository'
import { VendorRepository } from '../../interfaceAdapters/repositories/users/vendor_repository'
import { RefreshTokenRepository } from '../../interfaceAdapters/repositories/auth/refresh_token_repositories'
import { IRefreshTokenRepository } from '../../domain/repositoryInterfaces/auth/refresh_token_repository.interface'
import { RedisTokenRepository } from '../../interfaceAdapters/repositories/redis/redis_token_repository'
import { IRedisTokenRepository } from '../../domain/repositoryInterfaces/redis/redis_token_repository_interface'
import { IServiceCategoryRepository } from '../../domain/repositoryInterfaces/feature/service/service_category_repository.interface'
import { ServiceCategoryRepository } from '../../interfaceAdapters/repositories/feature/service/service_category_repository'
import { ISubServiceCategoryRepository } from '../../domain/repositoryInterfaces/feature/service/sub_service_catgory_repository.interface'
import { SubServiceCategoryRepository } from '../../interfaceAdapters/repositories/feature/service/sub_service_category_repository'
import { IServiceRepository } from '../../domain/repositoryInterfaces/feature/service/service_repository.interface'
import { ServiceRepository } from '../../interfaceAdapters/repositories/feature/service/service_repository'
import { IBookingRepository } from '../../domain/repositoryInterfaces/feature/booking/booking_repository.interface'
import { BookingRepository } from '../../interfaceAdapters/repositories/feature/booking/booking_repository'
import { IBookingHoldRepository } from '../../domain/repositoryInterfaces/feature/booking/booking_hold_repository.interface'
import { BookingHoldRepository } from '../../interfaceAdapters/repositories/feature/booking/booking_hold_repository'
import { IRedisSlotLockRepository } from '../../domain/repositoryInterfaces/redis/redis_slot_lock_repository_interface'
import { RedisSlotLockRepository } from '../../interfaceAdapters/repositories/redis/redis_slot_lock_repository'
import { IWalletRepository } from '../../domain/repositoryInterfaces/feature/payment/wallet_repository.interface'
import { WalletRepository } from '../../interfaceAdapters/repositories/feature/payment/wallet_repository'
import { IWalletTransactionRepository } from '../../domain/repositoryInterfaces/feature/payment/wallet_transaction.interface'
import { WalletTransactionRepository } from '../../interfaceAdapters/repositories/feature/payment/wallet_transaction_repository'
import { IAddressRepository } from '../../domain/repositoryInterfaces/feature/address/address_repository.interface'
import { AddressRepository } from '../../interfaceAdapters/repositories/feature/address/address_repository'
import { IPaymentRepository } from '../../domain/repositoryInterfaces/feature/payment/payment_repository.interface'
import { PaymentRepository } from '../../interfaceAdapters/repositories/feature/payment/payment_repository'
import { INotificationRepository } from '../../domain/repositoryInterfaces/feature/notification/notification_repository.interface'
import { NotificationRepository } from '../../interfaceAdapters/repositories/feature/notification/notification_repository'
import { IChatRepository } from '../../domain/repositoryInterfaces/feature/chat/chat_repository.interface'
import { ChatRepository } from '../../interfaceAdapters/repositories/feature/chat/chat_repository'
import { IMessageRepository } from '../../domain/repositoryInterfaces/feature/chat/message_repository.interface'
import { MessageRepository } from '../../interfaceAdapters/repositories/feature/chat/message_repository'

import { ISubscriptionPlanRepository } from '../../domain/repositoryInterfaces/feature/subscription/subscription_plan.interface'
import { SubscriptionPlanRepository } from '../../interfaceAdapters/repositories/feature/subscription/subscription_plan.repository'
import { IUserSubscriptionRepository } from '../../domain/repositoryInterfaces/feature/subscription/user_subscription.interface'
import { IRatingsReviewRepository } from '../../domain/repositoryInterfaces/feature/ratings_review/ratings_review_repository.interface'
import { RatingsReviewRepository } from '../../interfaceAdapters/repositories/feature/ratings_review/ratings_review_repository'
import { UserSubscriptionRepository } from '../../interfaceAdapters/repositories/feature/subscription/user_subscription.repository'

export class RepositoryRegistry {
  static registerRepositories(): void {
    container.register('IOtpRepository', {
      useClass: OtpRepository,
    })

    container.register('ICustomerRepository', {
      useClass: CustomerRepository,
    })

    container.register('IAdminRepository', {
      useClass: AdminRepository,
    })

    container.register('IVendorRepository', {
      useClass: VendorRepository,
    })

    container.register<IRefreshTokenRepository>('IRefreshTokenRepository', {
      useClass: RefreshTokenRepository,
    })

    container.register<IRedisTokenRepository>('IRedisTokenRepository', {
      useClass: RedisTokenRepository,
    })

    container.register<IServiceCategoryRepository>(
      'IServiceCategoryRepository',
      {
        useClass: ServiceCategoryRepository,
      },
    )
    container.register<ISubServiceCategoryRepository>(
      'ISubServiceCategoryRepository',
      {
        useClass: SubServiceCategoryRepository,
      },
    )
    container.register<IServiceRepository>('IServiceRepository', {
      useClass: ServiceRepository,
    })

    container.register<IBookingRepository>('IBookingRepository', {
      useClass: BookingRepository,
    })

    container.register<IBookingHoldRepository>('IBookingHoldRepository', {
      useClass: BookingHoldRepository,
    })

    container.register<IRedisSlotLockRepository>('IRedisSlotLockRepository', {
      useClass: RedisSlotLockRepository,
    })

    container.register<IWalletRepository>('IWalletRepository', {
      useClass: WalletRepository,
    })

    container.register<IWalletTransactionRepository>(
      'IWalletTransactionRepository',
      {
        useClass: WalletTransactionRepository,
      },
    )

    container.register<IAddressRepository>('IAddressRepository', {
      useClass: AddressRepository,
    })

    container.register<IPaymentRepository>('IPaymentRepository', {
      useClass: PaymentRepository,
    })

    container.register<INotificationRepository>('INotificationRepository', {
      useClass: NotificationRepository,
    })

    container.register<IChatRepository>('IChatRepository', {
      useClass: ChatRepository,
    })

    container.register<IMessageRepository>('IMessageRepository', {
      useClass: MessageRepository,
    })

    container.register<ISubscriptionPlanRepository>(
      'ISubscriptionPlanRepository',
      {
        useClass: SubscriptionPlanRepository,
      },
    )

    container.register<IUserSubscriptionRepository>(
      'IUserSubscriptionRepository',
      {
        useClass: UserSubscriptionRepository,
      },
    )

    container.register<IRatingsReviewRepository>('IRatingsReviewRepository', {
      useClass: RatingsReviewRepository,
    })
  }
}
