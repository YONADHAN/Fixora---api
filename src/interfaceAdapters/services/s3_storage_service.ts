import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { randomUUID } from 'crypto'
import { config } from '../../shared/config'
import { IStorageService } from '../../domain/serviceInterfaces/s3_storage_service_interface'

export class S3StorageService implements IStorageService {
  private s3: S3Client

  constructor() {
    if (!config.storageConfig.accessKey || !config.storageConfig.secretKey) {
      throw new Error('Missing AWS credentials in environment variables')
    }

    this.s3 = new S3Client({
      region: config.storageConfig.region!,
      credentials: {
        accessKeyId: config.storageConfig.accessKey!,
        secretAccessKey: config.storageConfig.secretKey!,
      },
    })
  }

  /**
   * Upload a single file to S3 inside an optional folder.
   */
  async uploadFile(
    bucketName: string,
    file: Express.Multer.File,
    folder = ''
  ): Promise<string> {
    try {
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ]

      if (!allowedTypes.includes(file.mimetype)) {
        throw new Error(`Unsupported file type: ${file.mimetype}`)
      }

      const ext = file.originalname.split('.').pop()
      const cleanFolder = folder ? folder.replace(/\/+$/, '') + '/' : ''
      const key = `${cleanFolder}${randomUUID()}.${ext}`

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })

      await this.s3.send(command)

      return this.getFileUrl(bucketName, key)
    } catch (err) {
      console.error('❌ AWS S3 Upload Error:', err)
      throw new Error('Failed to upload file to S3.')
    }
  }

  /**
   * Returns the public URL of a stored file.
   */
  getFileUrl(bucketName: string, key: string): string {
    return `${config.storageConfig.publicEndpoint}/${key}`
  }

  /**
   * Deletes a file from S3.
   */
  async deleteFile(bucketName: string, key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      })
      await this.s3.send(command)
    } catch (err) {
      console.error('❌ AWS S3 Delete Error:', err)
      throw new Error('Failed to delete file from S3.')
    }
  }
}
