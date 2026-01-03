"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    cors: {
        ALLOWED_ORIGIN: process.env.CORS_ALLOWED_ORIGIN || 'http://localhost:3000',
        FRONTEND_URL: process.env.NEXT_FRONTEND_URL || 'http://localhost:3000',
    },
    server: {
        PORT: process.env.PORT || 4000,
        NODE_ENV: process.env.NODE_ENV || 'development',
    },
    database: {
        URI: process.env.DATABASE_URI || '',
    },
    nodemailer: {
        EMAIL_USER: process.env.EMAIL_USER,
        EMAIL_PASS: process.env.EMAIL_PASS,
    },
    jwt: {
        ACCESS_SECRET_KEY: process.env.JWT_ACCESS_KEY || 'access-secret-key',
        ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
        REFRESH_SECRET_KEY: process.env.JWT_REFRESH_KEY || 'refresh-secret-key',
        REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '14d',
        RESET_SECRET_KEY: process.env.JWT_RESET_SECRET_KEY || 'reset-secret-key',
        RESET_EXPIRES_IN: process.env.JWT_RESET_EXPIRES_IN || '5m',
    },
    redis: {
        REDIS_USERNAME: process.env.REDIS_USERNAME || 'default',
        REDIS_PASS: process.env.REDIS_PASS,
        REDIS_HOST: process.env.REDIS_HOST,
        REDIS_PORT: process.env.REDIS_PORT || '18498',
    },
    storageConfig: {
        driver: process.env.STORAGE_DRIVER,
        bucket: process.env.S3_BUCKET,
        region: process.env.S3_REGION,
        accessKey: process.env.S3_ACCESS_KEY_ID,
        secretKey: process.env.S3_SECRET_ACCESS_KEY,
        publicEndpoint: process.env.S3_PUBLIC_ENDPOINT,
        useSSL: process.env.S3_USE_SSL === 'true',
    },
    googleAuth: {
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    },
    stripe: {
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    },
    OtpExpiry: process.env.OTP_EXPIRY_IN_MINUTES || '2',
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
};
