export interface RequestServiceCategoryDTO {
  page: number
  limit: number
  search: string
}

export interface ResponseServiceCategoryDTO {
  data: {
    serviceCategoryId: string
    name: string
    description: string
    bannerImage: string
    isActive: boolean
  }[]
  currentPage: number
  totalPages: number
}

export interface ResponseActiveServiceCategoriesDTO {
  data: {
    serviceCategoryId: string
    name: string
    description: string
    bannerImage: string
  }[]
}
