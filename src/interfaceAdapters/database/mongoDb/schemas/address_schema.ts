import { Schema } from 'mongoose'
import { IAddressModel } from '../models/address_model'

export const AddressSchema = new Schema<IAddressModel>(
  {
    addressId: {
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

    label: {
      type: String,
      default: 'Home',
    },

    addressType: {
      type: String,
      enum: ['home', 'office', 'other'],
      default: 'home',
    },

    isDefault: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    contactName: { type: String },
    contactPhone: { type: String },

    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    landmark: { type: String },

    city: { type: String },
    state: { type: String },
    country: { type: String, default: 'India' },
    zipCode: { type: String },

    instructions: { type: String },

    geoLocation: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },

    location: {
      name: { type: String },
      displayName: { type: String },
    },
  },
  { timestamps: true }
)

AddressSchema.index({ geoLocation: '2dsphere' })
AddressSchema.index({ customerId: 1 })
