export interface ICreateServiceCategoryUseCase {
  execute(params: {
    name: string
    description: string
    bannerImage?: Express.Multer.File
  }): Promise<void>
}
