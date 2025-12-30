import { Schema } from 'mongoose'
import { IMessageModel } from '../models/message_model'

export const MessageSchema = new Schema<IMessageModel>(
  {
    messageId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    chatId: {
      type: String,
      required: true,
      index: true,
    },

    senderId: {
      type: String,
      required: true,
    },

    senderRole: {
      type: String,
      enum: ['customer', 'vendor'],
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    messageType: {
      type: String,
      enum: ['text', 'image', 'system'],
      default: 'text',
    },

    replyTo: {
      messageId: { type: String },
      content: { type: String },
      senderId: { type: String },
    },

    booking: {
      bookingId: { type: String },
      bookingDate: { type: Date },
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)
