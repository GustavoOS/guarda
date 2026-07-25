declare var self: Worker;

import { optimizeImage } from "../../services/image";

export type ImageWorkerMessage = {
	type: "optimize";
	name: string;
	mime?: string;
};

self.onmessage = async (event: MessageEvent) => {
	const { name, mime }: ImageWorkerMessage = event.data;
	console.log("WORKER: received message to optimize image", { name, mime });
	await optimizeImage({ name, mime });
};
