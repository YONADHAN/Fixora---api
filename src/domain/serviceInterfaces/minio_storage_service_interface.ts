export interface IStorageService {
  uploadFile(
    bucketName: string,
    file: Express.Multer.File,
    folder?: string
  ): Promise<string>

  getFileUrl(bucketName: string, key: string): string

  deleteFile(bucketName: string, key: string): Promise<void>
}
