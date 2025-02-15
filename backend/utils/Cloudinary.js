import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';


cloudinary.config({
    // cloud_name: process.env.CLOUDINARY_NAME,
    // api_key: process.env.CLOUDINARY_API_KEY,
    // api_secret: process.env.CLOUDINARY_SECRET

    cloud_name: 'dy9upaojs',
    api_key: '326951612124735',
    api_secret: 'MhDjWOi7xbRbFub3YFk5Y1os54U'
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
        const publicId = FileUrl.split('/').pop().split('.')[0];
        const deleteResult = await cloudinary.uploader.destroy(publicId);
        return deleteResult;
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        throw new Error('Failed to delete image');
    }
}

function CheckFromCloudinary(url){
    return url.startsWith("https://res.cloudinary.com/");
}

export { uploadOnCloudinary, deleteFromCloudinary , CheckFromCloudinary};
