import sharp from "sharp";
import { s3Client } from "../infra/s3";

export async function optimizeImage({
	name,
	mime,
}: {
	name: string;
	mime?: string;
}) {
    console.log("Optimizing image:", { name, mime });
    if (name.match(/min-\d+$/)) {
		console.log(`Image ${name} is already optimized, skipping optimization.`);
		return;
	}
    if(!mime?.startsWith("image/")) {
        console.log(`File ${name} might not be an image, skipping optimization. Mime type: ${mime}`);
        return;
    }	
    const file = s3Client.file(name);
    const buffer = await file.arrayBuffer();
    const optimized = await sharp(buffer)
        .webp({ quality: 80 })
        .toBuffer();
    await s3Client.write(`${name}-min-80`, optimized, {type: "image/webp"});
    console.log("Image optimized and saved", { name, optimizedName: `${name}-min-80` });
}
