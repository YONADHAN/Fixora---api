import { ObjectId } from 'mongoose'

export interface IServiceCategoryEntity {
  _id?: string
  serviceCategoryId: string
  name: string
  description: string
  bannerImage: string
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
}
