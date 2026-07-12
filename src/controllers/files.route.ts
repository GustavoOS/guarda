import { sValidator } from "@hono/standard-validator";
import { Hono } from "hono";
import { createFile, findFiles } from "../services/file";
import { zPageable } from "../util/page.schema";
import { createFileSchema } from "./files.schema";

const filesController = new Hono()
	.post("/", sValidator("json", createFileSchema), async (c) => {
		const data = c.req.valid("json");
		const result = await createFile({ ...data, userId: 1 });
		return c.json(result);
	})
	.get("/", sValidator("query", zPageable), async (c) => {
		const { cursor, size } = c.req.valid("query");
		const result = await findFiles({ cursor, size, userId: 1 });
		return c.json(result);
	});

export default filesController;
