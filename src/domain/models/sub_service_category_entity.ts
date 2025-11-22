export interface ISubServiceCategoryEntity {
  subServiceCategoryId: string
  serviceCategoryId: string
  serviceCategoryName: string
  name: string
  description: string
  bannerImage: string
  isActive: boolean
  createdById: string
  createdByRole: string
  createdAt?: Date
  updatedAt?: Date
}
