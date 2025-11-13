import { ObjectId } from 'mongoose'

export interface IServiceEntity {
  serviceId: string
  name: string
  subtitle: string
  description: string
  imageUrls?: string[]
  categoryId: ObjectId
  isActive?: boolean
  vendorId: ObjectId
  createdAt?: Date
  updatedAt?: Date
}
