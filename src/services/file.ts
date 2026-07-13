import { and, asc, desc, eq, gt, lt } from "drizzle-orm";
import { db } from "../infra/db";
import { filesTable } from "../infra/db/schema";
import { s3Client } from "../infra/s3";

export async function createFile({
	filename,
	mimeType,
	createdAt,
	userId,
}: {
	filename: string;
	mimeType: string;
	createdAt: string;
	userId: number;
}) {
	const blobName = Bun.randomUUIDv7();
	return await db.transaction(async (tx) => {
		await tx.insert(filesTable).values({
			blobName,
			originalName: filename,
			mimeType: mimeType,
			uploadedBy: userId,
			createdAt,
		});
		const url = s3Client.presign(blobName, {
			method: "PUT",
			expiresIn: 3600,
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
	const whereCondition = cursorCondition
		? and(eq(filesTable.uploadedBy, userId), cursorCondition)
		: eq(filesTable.uploadedBy, userId);
	return await db
		.select()
		.from(filesTable)
		.where(whereCondition)
		.orderBy(sortMap[sortOrder](filesTable[sortBy]))
		.limit(size);
}
