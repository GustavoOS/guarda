import { sValidator } from "@hono/standard-validator";
import { Hono } from "hono";
import { getConnInfo } from "hono/bun";
import { getS3Client } from "../infra/s3";
import { createFile, findFiles } from "../services/file";
import { createFileSchema, getFileSchema } from "./files.schema";

const filesController = new Hono()
	.post("/", sValidator("json", createFileSchema), async (c) => {
		const data = c.req.valid("json");
		const connInfo = getConnInfo(c);
		const s3Client = getS3Client({ ip: connInfo.remote.address });
		const result = await createFile({ ...data, userId: 1, s3Client });
		return c.json(result);
	})
	.get("/", sValidator("query", getFileSchema), async (c) => {
		const query = c.req.valid("query");
		const connInfo = getConnInfo(c);
		const s3Client = getS3Client({ ip: connInfo.remote.address });
		const result = await findFiles({ ...query, userId: 1, s3Client });
		return c.json(result);
	});

export default filesController;
