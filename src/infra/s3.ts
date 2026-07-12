import { S3Client } from "bun";

export const s3Client = new S3Client({
    accessKeyId: Bun.env.S3_ACCESS_KEY_ID,
    secretAccessKey: Bun.env.S3_SECRET_ACCESS_KEY,
    endpoint: Bun.env.S3_ENDPOINT,
    bucket: Bun.env.S3_BUCKET_NAME,
})
