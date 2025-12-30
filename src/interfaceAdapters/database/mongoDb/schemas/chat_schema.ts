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

    customerId: {
      type: String,
      required: true,
      index: true,
    },

    vendorId: {
      type: String,
      required: true,
      index: true,
    },

    serviceId: {
      type: String,
      required: true,
      index: true,
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

ChatSchema.index({ customerId: 1, vendorId: 1, serviceId: 1 }, { unique: true })
