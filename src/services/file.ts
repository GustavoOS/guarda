import { and, asc, eq, gt } from "drizzle-orm";
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

export async function findFiles({ cursor, size, userId }: { cursor?: number; size: number; userId: number }) {
    const cursorCondition = cursor ? gt(filesTable.id, cursor) : undefined;
		const whereCondition = cursorCondition
			? and(eq(filesTable.uploadedBy, userId), cursorCondition)
			: eq(filesTable.uploadedBy, userId);
		return await db
			.select()
			.from(filesTable)
			.where(whereCondition)
			.orderBy(asc(filesTable.id))
			.limit(size);
}
