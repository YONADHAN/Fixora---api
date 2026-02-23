import { Types } from 'mongoose'

export interface UserSubscriptionMongoBase {
  _id: Types.ObjectId

  subscriptionId: string

  userId: string
  userRole: 'vendor' | 'customer'

  subscriptionPlanId: string

  stripeCheckoutSessionId?: string
  stripeSubscriptionId?: string

  startDate?: Date
  endDate?: Date

  status: 'pending' | 'active' | 'expired' | 'cancelled'
  autoRenew: boolean

  paymentProvider: 'stripe' | 'razorpay'
  paymentId?: string
  paymentStatus: 'initiated' | 'success' | 'failed'

  createdAt: Date
  updatedAt: Date
}
