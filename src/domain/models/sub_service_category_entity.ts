import { ObjectId } from 'mongoose'
import { statusTypes, verificationTypes } from '../../shared/constants'

export interface IServiceCategoryPopulated {
  serviceCategoryId: string
  name: string
  _id: string
}

export interface ISubServiceCategoryEntity {
  _id?: ObjectId
  subServiceCategoryId: string
  serviceCategoryRef: string
  serviceCategory?: IServiceCategoryPopulated
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
