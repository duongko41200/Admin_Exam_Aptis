import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

/**
 * Cloudflare R2 Configuration
 * R2 is compatible with S3 API, so we use AWS SDK
 */
class R2Config {
  constructor() {
    // Validate required environment variables
    this.validateConfig();

    this.config = {
      accountId: process.env.R2_ACCOUNT_ID,
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      bucketName: process.env.R2_BUCKET_NAME || "aptis-files",
      publicUrl: process.env.R2_PUBLIC_URL,
      // R2 endpoint format: https://<accountId>.r2.cloudflarestorage.com
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      region: "auto", // R2 uses 'auto' region
    };

    // Create S3 Client for R2
    this.client = new S3Client({
      region: this.config.region,
      endpoint: this.config.endpoint,
      credentials: {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
      },
      // Force path style for R2 compatibility
      forcePathStyle: false,
    });
  }

  validateConfig() {
    const requiredEnvVars = [
      "R2_ACCOUNT_ID",
      "R2_ACCESS_KEY_ID",
      "R2_SECRET_ACCESS_KEY",
      "R2_BUCKET_NAME",
      "R2_PUBLIC_URL",
    ];

    const missingVars = requiredEnvVars.filter(
      (envVar) => !process.env[envVar]
    );

    if (missingVars.length > 0) {
      throw new Error(
        `Missing required R2 environment variables: ${missingVars.join(", ")}`
      );
    }
  }

  getClient() {
    return this.client;
  }

  getConfig() {
    return this.config;
  }

  getBucketName() {
    return this.config.bucketName;
  }

  getPublicUrl() {
    return this.config.publicUrl;
  }
}

// Export singleton instance
export default new R2Config();
