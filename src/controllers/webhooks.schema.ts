import z from "zod";
import { zMime } from "../util/mime.schema";

const entrySchema = z.object({
	name: z.string(),
	attributes: z.object({
		file_size: z.int().min(0),
		mtime: z.int().min(0),
		file_mode: z.int().min(0),
		mime: zMime.optional(),
	}),
});

export const seaweedCreateSchema = z.object({
	event_type: z.literal("create"),
	key: z.string(),
	message: z.object({
		new_entry: entrySchema,
		new_parent_path: z.string().optional(),
	}),
});

export const seaweedUpdateSchema = z.object({
	event_type: z.literal("update"),
	key: z.string(),
	message: z.object({
		old_entry: entrySchema,
		new_entry: entrySchema,
		new_parent_path: z.string().optional(),
	}),
});

export const seaweedRenameSchema = z.object({
	event_type: z.literal("rename"),
	key: z.string(),
	message: z.object({
		old_entry: entrySchema,
		new_entry: entrySchema,
		new_parent_path: z.string().optional(),
	}),
});

export const seaweedDeleteSchema = z.object({
	event_type: z.literal("delete"),
	key: z.string(),
	message: z.object({
		old_entry: entrySchema,
	}),
});

export const seaweedWebhookSchema = z.discriminatedUnion("event_type", [
	seaweedCreateSchema,
	seaweedUpdateSchema,
	seaweedRenameSchema,
	seaweedDeleteSchema,
]);
