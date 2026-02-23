export interface IStorageService {
  /**
   * Upload a single file to the specified bucket (and optional folder).
   * Returns the public URL of the uploaded file.
   */
  uploadFile(
    bucketName: string,
    file: Express.Multer.File,
    folder?: string
  ): Promise<string>

  /**
   * Returns a public URL to access a file by its key.
   */
  getFileUrl(bucketName: string, key: string): string

  /**
   * Deletes a file from the specified bucket.
   */
  deleteFile(bucketName: string, key: string): Promise<void>
}
