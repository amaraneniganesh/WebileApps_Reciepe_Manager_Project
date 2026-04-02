import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadImage = async (fileBuffer: Buffer, mimeType: string): Promise<string> => {
    try {
        const b64 = fileBuffer.toString("base64");
        const dataURI = "data:" + mimeType + ";base64," + b64;
        const result = await cloudinary.uploader.upload(dataURI, { folder: "recipe_manager" });
        return result.secure_url;
    } catch (error) {
        throw new Error("Image upload failed");
    }
};