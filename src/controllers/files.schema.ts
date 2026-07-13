import z from "zod";
import { zMime } from "../util/mime.schema";

export const createFileSchema = z.object({
	filename: z
		.string()
		.min(1, { message: "File name is required" })
		.max(255, { message: "File name must be less than 255 characters" }),
	mimeType: zMime,
	createdAt: z.iso.datetime(),
});

export const getFileSchema = z.object({
	cursor: z.coerce.number().int().positive().optional(),
	size: z.coerce.number().int().min(1).max(100).default(10),
	sortBy: z.enum(["createdAt", "id"]).default("id"),
	sortOrder: z.enum(["asc", "desc"]).default("asc"),
});
