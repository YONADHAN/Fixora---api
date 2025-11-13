export interface IServiceCategoryEntity {
  serviceCategoryId: string
  name: string
  description?: string
  bannerImage?: string
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
}
