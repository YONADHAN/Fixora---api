import { Schema } from 'mongoose'
import { INotificationModel } from '../models/notification.model'

export const NotificationSchema = new Schema<INotificationModel>(
  {
    notificationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    recipientId: {
      type: String,
      required: true,
      index: true,
    },

    recipientRole: {
      type: String,
      enum: ['customer', 'vendor', 'admin'],
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        'BOOKING_CREATED',
        'BOOKING_CANCELLED',
        'BOOKING_CONFIRMED',
        'PAYMENT_SUCCESS',
        'PAYMENT_FAILED',
        'ADMIN_MESSAGE',
        'VENDOR_DOCUMENTS_SUBMITTED',
      ],
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    metadata: {
      bookingId: { type: String },
      serviceId: { type: String },
      paymentId: { type: String },
      redirectUrl: { type: String },
      vendorRef: { type: String },
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
)

NotificationSchema.index({ recipientId: 1, isRead: 1 })
NotificationSchema.index({ recipientId: 1, createdAt: -1 })
