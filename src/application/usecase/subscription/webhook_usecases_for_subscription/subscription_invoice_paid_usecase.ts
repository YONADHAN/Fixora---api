import { inject, injectable } from 'tsyringe'
import Stripe from 'stripe'
import crypto from 'crypto'
import { IUserSubscriptionRepository } from '../../../../domain/repositoryInterfaces/feature/subscription/user_subscription.interface'

import { ISubscriptionInvoicePaidUseCase } from '../../../../domain/useCaseInterfaces/subscription/webhook_usecase_interfaces_for_subscription/subscription_invoice_paid_usecase.interface'
import { IAdminRevenueRepository } from '../../../../domain/repositoryInterfaces/feature/payment/admin_revenue_repository.interface'
import { IWalletTransactionRepository } from '../../../../domain/repositoryInterfaces/feature/payment/wallet_transaction.interface'
import { IWalletRepository } from '../../../../domain/repositoryInterfaces/feature/payment/wallet_repository.interface'
import { IAdminRepository } from '../../../../domain/repositoryInterfaces/users/admin_repository.interface'
import { CustomError } from '../../../../domain/utils/custom.error'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../../shared/constants'
import { stripe } from '../../../../interfaceAdapters/stripe/stripe.client'
import { ICodeGeneratorService } from '../../../../domain/serviceInterfaces/counter_service_interface'
type StripeInvoiceWithSubscription = Stripe.Invoice & {
  subscription?: string | Stripe.Subscription | null
  parent?: {
    subscription_details?: {
      subscription?: string
    }
  }
}
@injectable()
export class SubscriptionInvoicePaidUseCase implements ISubscriptionInvoicePaidUseCase {
  constructor(
    @inject('IUserSubscriptionRepository')
    private readonly userSubscriptionRepository: IUserSubscriptionRepository,

    @inject('IAdminRevenueRepository')
    private readonly _adminRevenueRepository: IAdminRevenueRepository,

    @inject('IWalletTransactionRepository')
    private readonly _walletTransactionRepository: IWalletTransactionRepository,

    @inject('IWalletRepository')
    private readonly _walletRepository: IWalletRepository,

    @inject('IAdminRepository')
    private readonly _adminRepository: IAdminRepository,

    @inject('ICodeGeneratorService')
    private readonly _codeGeneratorService: ICodeGeneratorService
  ) { }



  async execute(invoice: Stripe.Invoice): Promise<void> {

    console.log("Invoice webhook triggered")




    const invoiceWithSubscription = invoice as StripeInvoiceWithSubscription

    let stripeSubscriptionId: string | null = null

    if (typeof invoiceWithSubscription.subscription === 'string') {
      stripeSubscriptionId = invoiceWithSubscription.subscription
    }

    if (!stripeSubscriptionId) {
      stripeSubscriptionId =
        invoiceWithSubscription.parent?.subscription_details?.subscription ?? null
    }

    console.log("Stripe subscription id:", stripeSubscriptionId)

    if (!stripeSubscriptionId) return





    const userSubscription = await this.userSubscriptionRepository.findOne({
      stripeSubscriptionId,

    })

    console.log("User subscription from DB:", userSubscription)

    if (!userSubscription) {
      console.log("No user subscription found")
      return
    }

    if (userSubscription.status === 'active') {
      console.log('Already processed webhook, skipping')
      return
    }

    // Get old active subs
    const oldSubscriptions = await this.userSubscriptionRepository.findAllDocsWithoutPagination({
      userId: userSubscription.userId,
      status: 'active',
    })

    // Expire in DB first
    await this.userSubscriptionRepository.updateMany(
      {
        userId: userSubscription.userId,
        status: 'active',
        subscriptionId: { $ne: userSubscription.subscriptionId },
      },
      {
        status: 'expired',
      }
    )

    // Cancel in Stripe safely
    for (const sub of oldSubscriptions) {
      if (
        sub.subscriptionId !== userSubscription.subscriptionId &&
        sub.stripeSubscriptionId
      ) {
        try {
          await stripe.subscriptions.cancel(sub.stripeSubscriptionId)
        } catch (err: unknown) {
          if (err instanceof Stripe.errors.StripeError) {
            if (err.code === 'resource_missing') {
              console.log('Already canceled:', sub.stripeSubscriptionId)
            } else {
              console.error('Stripe cancel error:', err.message)
            }
          } else {
            console.error('Unexpected error:', err)
          }
        }
      }
    }


    const lineItem = invoice.lines.data[0]
    if (!lineItem) {
      console.log('No invoice line items found')
      return
    }
    const startDate = new Date(lineItem.period.start * 1000)
    const endDate = new Date(lineItem.period.end * 1000)
    //Create new Subscription in DB
    await this.userSubscriptionRepository.update(
      { subscriptionId: userSubscription.subscriptionId },
      {
        startDate,
        endDate,
        status: 'active',
        paymentStatus: 'success',
        autoRenew: true,
      },
    )

    const amount = invoice.amount_paid / 100

    console.log("Saving admin revenue:", amount)

    const existingRevenue = await this._adminRevenueRepository.findOne({
      referenceId: userSubscription.subscriptionId,
      source: "subscription"
    })

    if (!existingRevenue) {
      await this._adminRevenueRepository.save({
        revenueId: `REV_${crypto.randomUUID()}`,
        amount,
        referenceId: userSubscription.subscriptionId,
        source: 'subscription',
        currency: 'INR',

      })
    }

    const adminEmail = process.env.SEED_ADMIN_EMAIL;

    const admin = await this._adminRepository.findOne({ email: adminEmail })
    if (!admin) {
      throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
    }
    if (!admin._id) {
      throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
    }

    const adminWallet = await this._walletRepository.findOne({ userRef: admin?._id })

    if (!adminWallet) {
      throw new CustomError(ERROR_MESSAGES.WALLET_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
    }


    const transactionCode =
  await this._codeGeneratorService.generateWalletTransactionCode()

    await this._walletTransactionRepository.save({
      transactionId: `TXN_${crypto.randomUUID()}`,
      transactionCode,
      userRef: admin._id.toString(),
      walletRef: adminWallet._id,
      amount,
      type: "credit",
      source: "subscription",
      description: "Subscription fee",

    })

    await this._walletRepository.incrementBalance(
      adminWallet.walletId,
      amount
    )

  }
}
