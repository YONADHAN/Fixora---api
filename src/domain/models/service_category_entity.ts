export interface IServiceCategoryEntity {
  serviceCategoryId: string
  name: string
  description?: string
  bannerImage?: string
  icon?: string
  isActive?: boolean
  displayOrder?: number
  createdAt?: Date
  updatedAt?: Date
}
