import { Schema } from 'mongoose'
import { IChatModel } from '../models/chat_model'

export const ChatSchema = new Schema<IChatModel>(
  {
    chatId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    customerRef: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: 'Customer'
    },

    vendorRef: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: 'Vendor'
    },

    serviceRef: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: 'Service'
    },

    lastMessage: {
      messageId: { type: String },
      content: { type: String },
      senderId: { type: String },
      senderRole: {
        type: String,
        enum: ['customer', 'vendor'],
      },
      createdAt: { type: Date },
    },

    unreadCount: {
      customer: { type: Number, default: 0 },
      vendor: { type: Number, default: 0 },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

ChatSchema.index({ customerRef: 1, vendorRef: 1, serviceRef: 1 }, { unique: true })
