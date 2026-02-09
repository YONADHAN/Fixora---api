export interface IAiSubServiceCategoryRepository {
  getSubServiceCategories(params?: {
    serviceCategoryId?: string
    onlyActive?: boolean
  }): Promise<
    Array<{
      subServiceCategoryId: string
      name: string
      description?: string
      serviceCategoryName?: string
    }>
  >
}
