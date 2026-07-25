import type z from "zod";
import type {
	seaweedCreateSchema,
	seaweedDeleteSchema,
	seaweedRenameSchema,
	seaweedUpdateSchema,
	seaweedWebhookSchema,
} from "../controllers/webhooks.schema";
import { epochSecondsToDate } from "../util/time";
import { completeUpload } from "./file";

const worker = new Worker(
	new URL("../infra/workers/imageWorker.ts", import.meta.url),
);
worker.addEventListener("error", (event) => {
	console.error("imageWorker error:", event.message ?? event);
});
worker.addEventListener("close", () => {
	console.error("imageWorker closed unexpectedly");
});

async function createSeaweedWebhookHandler(
	req: z.infer<typeof seaweedCreateSchema>,
) {
	console.log("Create event received for key", req.key);
	worker.postMessage({
			type: "optimize",
			name: req.message.new_entry.name,
			mime: req.message.new_entry.attributes.mime,
		})
	return completeUpload({
			uploadCompletedAt: epochSecondsToDate.decode(
				req.message.new_entry.attributes.mtime,
			),
			name: req.message.new_entry.name,
		});
}

async function updateSeaweedWebhookHandler(
	req: z.infer<typeof seaweedUpdateSchema>,
) {
	console.log("Update event received for key", req.key);
	worker.postMessage({
			type: "optimize",
			name: req.message.new_entry.name,
			mime: req.message.new_entry.attributes.mime,
		})
	return completeUpload({
			uploadCompletedAt: epochSecondsToDate.decode(
				req.message.new_entry.attributes.mtime,
			),
			name: req.message.new_entry.name,
		});
}

async function deleteSeaweedWebhookHandler(
	req: z.infer<typeof seaweedDeleteSchema>,
) {
	console.error(
		`Delete event received for file ${req.message.old_entry.name}. This event is not handled yet.`,
	);
}

async function renameSeaweedWebhookHandler(
	req: z.infer<typeof seaweedRenameSchema>,
) {
	console.error(
		`Rename event received for file ${req.message.old_entry.name} to ${req.message.new_entry.name}. This event is not handled yet.`,
	);
}

export default async function handleSeaweedWebhook(
	req: z.infer<typeof seaweedWebhookSchema>,
) {
	switch (req.event_type) {
		case "create":
			return createSeaweedWebhookHandler(req);
		case "update":
			return updateSeaweedWebhookHandler(req);
		case "delete":
			return deleteSeaweedWebhookHandler(req);
		case "rename":
			return renameSeaweedWebhookHandler(req);
	}
}
