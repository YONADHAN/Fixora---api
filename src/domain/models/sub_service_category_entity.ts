import { ObjectId } from 'mongoose'
import { statusTypes, verificationTypes } from '../../shared/constants'

export interface ISubServiceCategoryEntity {
  _id?: ObjectId
  subServiceCategoryId: string
  serviceCategoryId: string
  serviceCategoryName: string
  name: string
  description: string
  bannerImage: string
  isActive: statusTypes
  verification: verificationTypes
  createdById: string
  createdByRole: string
  createdAt?: Date
  updatedAt?: Date
}
