import { S3Client } from "bun";
import { cache } from "./cache";
import { findLocalNetwork, getIpv4Ips, normalizeIp } from "./connectivity/network";

export const s3Client = new S3Client({
	accessKeyId: Bun.env.S3_ACCESS_KEY_ID,
	secretAccessKey: Bun.env.S3_SECRET_ACCESS_KEY,
	endpoint: Bun.env.S3_ENDPOINT,
	bucket: Bun.env.S3_BUCKET_NAME,
	region: Bun.env.S3_REGION ?? "us-east-1",
});

export const DEFAULT_EXPIRES_IN = 3600; // 1 hour in seconds

export function getS3Client({ ip }: { ip?: string }): S3Client {
	if (!ip && !cache.get("publicIp")) {
		throw new Error("No client IP and public IP not found in cache");
	}
	const localNetwork = findLocalNetwork({ ip: normalizeIp(ip ?? ""), networks: getIpv4Ips() });
	const url = `http://${localNetwork?.address ?? cache.get("publicIp")}:8333`;
	console.log("Using S3 endpoint:", url);
	return new S3Client({
		accessKeyId: Bun.env.S3_ACCESS_KEY_ID,
		secretAccessKey: Bun.env.S3_SECRET_ACCESS_KEY,
		endpoint: url,
		bucket: Bun.env.S3_BUCKET_NAME,
	});
}
