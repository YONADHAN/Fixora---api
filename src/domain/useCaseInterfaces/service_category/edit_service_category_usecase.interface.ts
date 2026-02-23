export interface IEditServiceCategoryUseCase {
  execute(
    categoryId: string,
    name: string,
    description: string,
    bannerImage?: Express.Multer.File
  ): Promise<void>
}
