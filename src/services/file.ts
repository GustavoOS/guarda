import type { S3Client } from "bun";
import { and, asc, desc, eq, gt, isNotNull, lt } from "drizzle-orm";
import type { Point } from "geojson";
import { db } from "../infra/db";
import { filesTable } from "../infra/db/schema";
import { DEFAULT_EXPIRES_IN } from "../infra/s3";

export async function createFile({
	filename,
	createdAt,
	userId,
	coordinates,
	s3Client,
}: {
	filename: string;
	createdAt: string;
	userId: number;
	coordinates?: Point;
	s3Client: S3Client;
}) {
	const blobName = Bun.randomUUIDv7();
	return await db.transaction(async (tx) => {
		await tx.insert(filesTable).values({
			blobName,
			originalName: filename,
			uploadedBy: userId,
			createdAt,
			coordinates,
		});
		const url = s3Client.presign(blobName, {
			method: "PUT",
			expiresIn: DEFAULT_EXPIRES_IN,
		});
		return { blobName, url };
	});
}

const sortMap = {
	asc,
	desc,
};
const sortOperation = {
	asc: gt,
	desc: lt,
};
export async function findFiles({
	cursor,
	size,
	userId,
	sortBy,
	sortOrder,
	s3Client,
}: {
	cursor?: number;
	size: number;
	userId: number;
	sortBy: "createdAt" | "id";
	sortOrder: "asc" | "desc";
	s3Client: S3Client;
}) {
	const cursorCondition = cursor
		? sortOperation[sortOrder](filesTable.id, cursor)
		: undefined;
	const result = await db
		.select()
		.from(filesTable)
		.where(
			and(
				eq(filesTable.uploadedBy, userId),
				isNotNull(filesTable.uploadCompletedAt),
				cursorCondition,
			),
		)
		.orderBy(sortMap[sortOrder](filesTable[sortBy]))
		.limit(size);
	return result.map((file) => ({
		...file,
		preview: s3Client.presign(`${file.blobName}-min-80`, {
			method: "GET",
			expiresIn: DEFAULT_EXPIRES_IN,
			type: "image/webp",
		}),
	}));
}

export async function completeUpload({
	uploadCompletedAt,
	mimeType,
	name,
}: {
	uploadCompletedAt: Date;
	name: string;
	mimeType?: string;
}) {
	return db
		.update(filesTable)
		.set({ uploadCompletedAt: uploadCompletedAt.toISOString(), mimeType })
		.where(eq(filesTable.blobName, name));
}
