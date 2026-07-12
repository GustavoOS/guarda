import z from "zod";
import { zMime } from "../util/mime.schema";

export const createFileSchema = z.object({
	filename: z
		.string()
		.min(1, { message: "File name is required" })
		.max(255, { message: "File name must be less than 255 characters" }),
    mimeType: zMime,
	createdAt: z.iso.datetime()
});
