import mime from "mime";
import z from "zod";

export const zMime = z.stringFormat(
	"mime-type",
	(val) => {
		const mimeType = mime.getExtension(val);
		return !!mimeType;
	},
	{ message: "Invalid MIME type" },
);
