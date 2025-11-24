import { statusTypes, verificationTypes } from '../../shared/constants'

//create sub service category controller
export interface RequestCreateSubServiceCategoryDTO {
  name: string
  description: string
  bannerImage: Express.Multer.File
  serviceCategoryId: string
  serviceCategoryName: string
  createdById: string
  createdByRole: string
  isActive: statusTypes
}

export interface ResponseCreateSubServiceCategoryDTO {
  name: string
  description: string
  bannerImage: string
  serviceCategoryId: string
  serviceCategoryName: string
  subServiceCategoryId: string
}

//get all sub service category controller
export interface RequestGetAllSubServiceCategoriesDTO {
  page: number
  limit: number
  search: string
}

export interface SubServiceCategoryItem {
  name: string
  description: string
  bannerImage: string
  serviceCategoryId: string
  subServiceCategoryId: string
  isActive: statusTypes
}
export interface ResponseGetAllSubServiceCategoriesDTO {
  data: SubServiceCategoryItem[]
  currentPage: number
  totalPages: number
}

//edit all sub service category controller
export interface RequestEditSubServiceCategoriesDTO {
  subServiceCategoryId: string
  name: string
  description: string
  serviceCategoryId: string
  serviceCategoryName: string
  bannerImage: Express.Multer.File
}

export interface ResponseEditSubServiceCategoriesDTO {
  name: string
  description: string
  bannerImage: string
  serviceCategoryId: string
  serviceCategoryName: string
  subServiceCategoryId: string
}

//get single sub service category
export interface RequestGetSingleSubServiceCategoryDTO {
  subServiceCategoryId: string
}

export interface ResponseGetSingleSubServiceCategoryDTO {
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
  createdAt: Date
  updatedAt: Date
}

//toggle block status of sub service category

export interface RequestToggleBlockStatusOfSubServiceCategoryDTO {
  subServiceCategoryId: string
  blockStatus: statusTypes
}

//toggle verification status of sub service category

export interface RequestToggleVerificationStatusOfSubServiceCategoryDTO {
  subServiceCategoryId: string
  verificationStatus: verificationTypes
}
