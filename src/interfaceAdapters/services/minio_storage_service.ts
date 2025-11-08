import { injectable } from 'tsyringe'
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { randomUUID } from 'crypto'
import { config } from '../../shared/config'
import { IStorageService } from '../../domain/serviceInterfaces/minio_storage_service_interface'

@injectable()
export class MinioStorageService implements IStorageService {
  private s3: S3Client

  constructor() {
    this.s3 = new S3Client({
      endpoint: config.storageConfig.endpoint,
      region: config.storageConfig.region,
      credentials: {
        accessKeyId: config.storageConfig.accessKey,
        secretAccessKey: config.storageConfig.secretKey,
      },
      forcePathStyle: true,
    })
  }

  /**
   * Upload a single file to the specified bucket.
   * Automatically creates unique file names and optional folder separation.
   */
  async uploadFile(
    bucketName: string,
    file: Express.Multer.File,
    folder = ''
  ): Promise<string> {
    try {
      //  Validate file type defensively (backend check)
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      ]
      if (!allowedTypes.includes(file.mimetype)) {
        throw new Error(`Unsupported file type: ${file.mimetype}`)
      }

      //  Build unique, safe object key
      const fileExt = file.originalname.split('.').pop()
      const cleanFolder = folder ? folder.replace(/\/+$/, '') + '/' : ''
      const uniqueKey = `${cleanFolder}${randomUUID()}.${fileExt}`

      //  Upload to MinIO
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: uniqueKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      })

      await this.s3.send(command)

      //  Return clean, accessible public URL
      return this.buildFileUrl(bucketName, uniqueKey)
    } catch (err) {
      console.error('❌ MinIO Upload Error:', err)
      throw new Error('Failed to upload file to MinIO.')
    }
  }

  /**
   * Generate public URL for a stored file.
   */
  getFileUrl(bucketName: string, key: string): string {
    return this.buildFileUrl(bucketName, key)
  }

  /**
   * Delete a file from a bucket.
   */
  async deleteFile(bucketName: string, key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      })
      await this.s3.send(command)
    } catch (err) {
      console.error('❌ MinIO Delete Error:', err)
      throw new Error('Failed to delete file from MinIO.')
    }
  }

  /**
   * 🔧 Private helper to safely build file URLs and clean extra slashes.
   */
  private buildFileUrl(bucket: string, key: string): string {
    const rawUrl = `${config.storageConfig.publicEndpoint}/${bucket}/${key}`
    return rawUrl.replace(/([^:]\/)\/+/g, '$1')
  }
}
