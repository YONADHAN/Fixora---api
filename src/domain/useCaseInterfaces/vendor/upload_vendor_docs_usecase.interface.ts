export interface IUploadVendorDocsUseCase {
  execute(
    userId: string,
    files: Express.Multer.File[],
    urls: string[]
  ): Promise<void>
}
