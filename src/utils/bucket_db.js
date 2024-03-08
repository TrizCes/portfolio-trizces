const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  endpoint: process.env.ENDPOINT_S3,
  region: process.env.REGION_S3,
  credentials: {
    accessKeyId: process.env.KEY_ID,
    secretAccessKey: process.env.APP_KEY,
  },
});

module.exports = { s3, PutObjectCommand, DeleteObjectCommand };
