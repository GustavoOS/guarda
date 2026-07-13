import { sValidator } from "@hono/standard-validator";
import { Hono } from "hono";
import { createFile, findFiles } from "../services/file";
import { createFileSchema, getFileSchema } from "./files.schema";

const filesController = new Hono()
	.post("/", sValidator("json", createFileSchema), async (c) => {
		const data = c.req.valid("json");
		const result = await createFile({ ...data, userId: 1 });
		return c.json(result);
	})
	.get("/", sValidator("query", getFileSchema), async (c) => {
		const query = c.req.valid("query");
		const result = await findFiles({ ...query, userId: 1 });
		return c.json(result);
	});

export default filesController;
