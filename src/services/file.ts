import { and, asc, desc, eq, gt, isNotNull, lt } from "drizzle-orm";
import type { Point } from "geojson";
import { db } from "../infra/db";
import { filesTable } from "../infra/db/schema";
import { DEFAULT_EXPIRES_IN, s3Client } from "../infra/s3";

export async function createFile({
	filename,
	mimeType,
	createdAt,
	userId,
	coordinates,
}: {
	filename: string;
	mimeType: string;
	createdAt: string;
	userId: number;
	coordinates?: Point;
}) {
	const blobName = Bun.randomUUIDv7();
	return await db.transaction(async (tx) => {
		await tx.insert(filesTable).values({
			blobName,
			originalName: filename,
			mimeType: mimeType,
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
}: {
	cursor?: number;
	size: number;
	userId: number;
	sortBy: "createdAt" | "id";
	sortOrder: "asc" | "desc";
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
			type: file.mimeType,
		}),
	}));
}

export async function completeUpload({
	uploadCompletedAt,
	name,
}: {
	uploadCompletedAt: Date;
	name: string;
}) {
	return db
		.update(filesTable)
		.set({ uploadCompletedAt: uploadCompletedAt.toISOString() })
		.where(eq(filesTable.blobName, name));
}
