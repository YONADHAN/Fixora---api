import 'dotenv/config'
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3'

const s3 = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT || 'http://localhost:9000',
  region: process.env.MINIO_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretAccessKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
  },
  forcePathStyle: true, // Important for MinIO
})

;(async () => {
  try {
    const res = await s3.send(new ListBucketsCommand({}))
    console.log('✅ Buckets:', res.Buckets)
  } catch (err) {
    console.error('❌ Connection failed:', err)
  }
})()
