import sharp from "sharp";
import { s3Client } from "../infra/s3";

export async function optimizeImage({
	name,
	mime,
}: {
	name: string;
	mime?: string;
}) {
    if(!mime?.startsWith("image/")) {
        console.log(`File ${name} is not an image, skipping optimization. Mime type: ${mime}`);
        return;
    }
	if (name.match(/min-\d+$/)) {
		console.log(`Image ${name} is already optimized, skipping optimization.`);
		return;
	}
    const file = s3Client.file(name);
    const buffer = await file.arrayBuffer();
    const optimized = await sharp(buffer)
        .webp({ quality: 80 })
        .toBuffer();
    s3Client.write(`${name}-min-80`, optimized)
    console.log(`Image ${name} optimized and saved as ${name}-min-80`);
}
