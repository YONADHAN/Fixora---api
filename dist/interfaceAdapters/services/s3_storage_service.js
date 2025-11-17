"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3StorageService = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const crypto_1 = require("crypto");
const config_1 = require("../../shared/config");
class S3StorageService {
    constructor() {
        if (!config_1.config.storageConfig.accessKey || !config_1.config.storageConfig.secretKey) {
            throw new Error('Missing AWS credentials in environment variables');
        }
        this.s3 = new client_s3_1.S3Client({
            region: config_1.config.storageConfig.region,
            credentials: {
                accessKeyId: config_1.config.storageConfig.accessKey,
                secretAccessKey: config_1.config.storageConfig.secretKey,
            },
        });
    }
    /**
     * Upload a single file to S3 inside an optional folder.
     */
    async uploadFile(bucketName, file, folder = '') {
        try {
            const allowedTypes = [
                'image/jpeg',
                'image/png',
                'application/pdf',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ];
            if (!allowedTypes.includes(file.mimetype)) {
                throw new Error(`Unsupported file type: ${file.mimetype}`);
            }
            const ext = file.originalname.split('.').pop();
            const cleanFolder = folder ? folder.replace(/\/+$/, '') + '/' : '';
            const key = `${cleanFolder}${(0, crypto_1.randomUUID)()}.${ext}`;
            const command = new client_s3_1.PutObjectCommand({
                Bucket: bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            });
            await this.s3.send(command);
            return this.getFileUrl(bucketName, key);
        }
        catch (err) {
            console.error(' AWS S3 Upload Error:', err);
            throw new Error('Failed to upload file to S3.');
        }
    }
    /**
     * Returns the public URL of a stored file.
     */
    getFileUrl(bucketName, key) {
        return `${config_1.config.storageConfig.publicEndpoint}/${key}`;
    }
    /**
     * Deletes a file from S3.
     */
    async deleteFile(bucketName, key) {
        try {
            const command = new client_s3_1.DeleteObjectCommand({
                Bucket: bucketName,
                Key: key,
            });
            await this.s3.send(command);
        }
        catch (err) {
            console.error(' AWS S3 Delete Error:', err);
            throw new Error('Failed to delete file from S3.');
        }
    }
}
exports.S3StorageService = S3StorageService;
