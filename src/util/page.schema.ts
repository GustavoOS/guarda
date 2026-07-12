import z from "zod";

export const zPageable = z.object({
	cursor: z.coerce.number().int().positive().optional(),
	size: z.coerce.number().int().min(1).max(100).default(10),
});
