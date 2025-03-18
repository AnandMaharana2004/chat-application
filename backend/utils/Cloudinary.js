import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME ,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const uploadOnCloudinary = async (filePath) => {
    try {
        if (!filePath) throw new Error("File path is required");

        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto" // Automatically detect image, video, etc.
        });

        // console.log("Cloudinary Upload Success:", uploadResult);
        return uploadResult;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        throw new Error("Failed to upload file to Cloudinary");
    } finally {
        // Delete file from local storage after upload attempt
        try {
            await fs.unlink(filePath);
        } catch (unlinkError) {
            console.error("Error deleting file:", unlinkError);
        }
    }
};


const deleteFromCloudinary = async (FileUrl) => {
    try {
        // Extract public ID from the URL.
        const parts = FileUrl.split('/');
        const filename = parts.pop();
        const publicId = filename.split('.')[0];

        // Delete the image from Cloudinary.
        const deleteResult = await cloudinary.uploader.destroy(publicId);

        // Check the result for success.
        if (deleteResult.result === 'ok') {
            return deleteResult; // Return the full result on success.
        } else {
            console.error('Cloudinary deletion failed:', deleteResult);
            throw new Error('Failed to delete image from Cloudinary');
        }

    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        throw new Error('Failed to delete image from Cloudinary');
    }
};

function CheckFromCloudinary(url) {
    return url.startsWith("https://res.cloudinary.com/");
}

export { uploadOnCloudinary, deleteFromCloudinary, CheckFromCloudinary };
