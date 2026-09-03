# Fixora API

This repository contains the backend API for **Fixora**, providing all core business logic, real-time communication, database interactions, and integrations required to power the Fixora client application.

## Overview

The Fixora API is a robust, well-structured Node.js application built using TypeScript and Express. It strictly adheres to **Clean Architecture** principles to separate core business domain logic from infrastructure details, ensuring long-term maintainability, scalability, and testability.

## Technology Stack

### Core
* **Runtime:** Node.js
* **Language:** TypeScript
* **Framework:** Express (v5)
* **Database & ORM:** MongoDB with Mongoose

### Integrations & Services
* **Authentication:** JWT (JSON Web Tokens) with refresh token mechanisms, and Bcrypt for password hashing.
* **Real-time Communication:** Socket.io paired with a Redis adapter for scalable WebSockets.
* **AI Chatbot:** LangChain (`@langchain/core`, `@langchain/groq`) powered by Groq SDK.
* **Storage & Uploads:** AWS S3 Client (`@aws-sdk/client-s3`), Multer, and Cloudinary.
* **Payments:** Stripe.
* **Email:** Nodemailer.
* **Background Jobs:** Node-cron for scheduled tasks (e.g., booking hold expirations).

### Security & Validation
* **Data Validation:** Zod.
* **API Security:** Helmet for HTTP headers, CORS, and `express-rate-limit` for request throttling.
* **Logging:** Winston (with daily rotate file) and Morgan for request observability.

## Architecture

The project is structured according to **Clean Architecture**, divided into discrete layers:

* **Domain (`src/domain`):** Contains core business entities (User, Customer, Vendor, Admin, Booking, Service, etc.) and interfaces (repository and service contracts). This layer has zero dependencies on external frameworks.
* **Application (`src/application`):** Implements business use cases and strategies (e.g., booking workflows, chat logic, auth processes).
* **Interface Adapters (`src/interfaceAdapters`):** Acts as the translation layer connecting external elements to the application. Contains MongoDB setup, database repositories, external API clients (Stripe, AI, S3), and schedulers.
* **Presentation (`src/presentation`):** The delivery mechanism. Contains Express routes, HTTP controllers, Socket.io event handlers, custom middleware, and request validation logic. Uses `tsyringe` for dependency injection.
* **Shared (`src/shared`):** Contains application-wide configurations, TypeScript type definitions, constants, and global utilities (like error handling and logging).

## Key Modules

* **Authentication:** Registration, login, OTP verification, and JWT issuance.
* **Users & Dashboards:** Distinct controllers and logic for Customers, Vendors, and Admins.
* **Services:** Management of service categories, sub-categories, and individual vendor services.
* **Booking & Scheduling:** Complex state management for bookings, including a temporary booking hold mechanism powered by node-cron.
* **Payments & Wallets:** Stripe webhook integration, payment processing, and in-app user wallets.
* **Communication:** Real-time chat integration and a robust notification system.
* **AI Chatbot:** A dedicated AI service utilizing Groq and LangChain to provide intelligent conversational capabilities based on system context.

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file.

> [!CAUTION]
> Never commit actual secrets or keys to version control.

```env
# Server
PORT=<your-port>
NODE_ENV=<development|production>
CORS_ALLOWED_ORIGIN=<frontend-url>
NEXT_FRONTEND_URL=<frontend-url>

# Database
DATABASE_URI=<mongodb-connection-string>

# Email Configuration
EMAIL_USER=<your-email@example.com>
EMAIL_PASS=<your-email-password>

# JWT Secrets
JWT_ACCESS_KEY=<secret-key>
JWT_ACCESS_EXPIRES_IN=<time>
JWT_REFRESH_KEY=<secret-key>
JWT_REFRESH_EXPIRES_IN=<time>
JWT_RESET_SECRET_KEY=<secret-key>
JWT_RESET_EXPIRES_IN=<time>

# Redis (Socket.io adapter)
REDIS_USERNAME=<username>
REDIS_PASS=<password>
REDIS_HOST=<host>
REDIS_PORT=<port>

# Security
OTP_EXPIRY_IN_MINUTES=<minutes>
BCRYPT_SALT_ROUNDS=<rounds>

# Google OAuth
GOOGLE_CLIENT_ID=<client-id>
GOOGLE_CLIENT_SECRET=<client-secret>

# Storage (S3 / MinIO)
STORAGE_DRIVER=<s3|minio>
S3_REGION=<region>
S3_BUCKET=<bucket-name>
S3_ACCESS_KEY_ID=<access-key>
S3_SECRET_ACCESS_KEY=<secret-key>
S3_PUBLIC_ENDPOINT=<endpoint-url>
S3_USE_SSL=<true|false>

# Payments
STRIPE_SECRET_KEY=<stripe-secret>
STRIPE_WEBHOOK_SECRET=<webhook-secret>

# AI Integration
GEMINI_API_KEY=<gemini-key>
GROQ_API_KEY=<groq-key>
GROQ_MODEL=<model-name>

# Database Seeding
ENABLE_SEED_ADMIN=<true|false>
SEED_ADMIN_NAME=<admin-name>
SEED_ADMIN_EMAIL=<admin-email>
SEED_ADMIN_PHONE_NUMBER=<admin-phone>
SEED_ADMIN_PASSWORD=<admin-password>
```

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server (runs with `nodemon` and `ts-node`):
   ```bash
   npm run dev
   ```

3. To build the TypeScript project for production:
   ```bash
   npm run build
   ```

## Docker & Deployment

The application is fully containerized and uses GitHub Actions for continuous deployment.

1. **Build Image Locally:**
   ```bash
   docker build -t fixora-api:latest .
   ```

2. **CI/CD Pipeline:**
   The `.github/workflows/deploy.yml` action triggers on pushes to the `master` branch. It automatically builds the Docker image, pushes it to DockerHub, and uses SSH to pull and restart the container on an EC2 instance.
