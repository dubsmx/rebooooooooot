import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "./env";

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY
  }
});

export async function presignPut(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: env.R2_BUCKET,
    Key: key,
    ContentType: contentType,
    ACL: "public-read" as any
  });
  const url = await getSignedUrl(r2, command, { expiresIn: 300 });
  return { url, key };
}

export function r2Url(key: string) {
  return `${env.NEXT_PUBLIC_R2_PUBLIC_BASE.replace(/\/$/, "")}/${key}`;
}