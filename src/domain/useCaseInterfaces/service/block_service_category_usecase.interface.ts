export interface IBlockServiceCategoryUseCase {
  execute(
    categoryId: string,
    status: string
  ): Promise<{
    success: boolean
    message: string
  }>
}
