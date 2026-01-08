import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import 'dotenv/config';
import { ApiError } from './apiError';


// configure cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async(localfilepath) => {
    try {
        if (!localfilepath) return null;
        
        // Check if file exists
        if (!fs.existsSync(localfilepath)) {
            console.error("File does not exist at path:", localfilepath);
            return null;
        }

        // upload the file in cloudinary
        const response = await cloudinary.uploader.upload(localfilepath, {
            resource_type:"auto"
        });
        
        // file has been uploaded successfully
        console.log("file is uploaded on cloudinary", response.url);
        
        // Remove the locally saved temporary file after successful upload
        fs.unlinkSync(localfilepath);
        
        return response;

    } catch (error) {
        console.error("Error uploading file to cloudinary:", error);
        
        // Remove the locally saved temporary file as the upload operation failed
        // Wrap in try-catch to handle case where file might not exist
        try {
            if (fs.existsSync(localfilepath)) {
                fs.unlinkSync(localfilepath);
            }
        } catch (unlinkError) {
            console.error("Error removing local file:", unlinkError);
        }
        
        return null;
    }
}
const deleteFromCloudnary = async(oldFileUrl)=>{
    if(!oldFileUrl){
        throw new ApiError(400,"Error while fetching file url from DB")
    }
    try {
        if (!oldFileUrl.includes("/upload/")) {
            throw new Error("Invalid Cloudinary URL");
        }
        const publicId = oldFileUrl
            .split("/upload/")[1]
            .replace(/\.[^/.]+$/, ""); // remove extension safely
        
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Asset removed from cloudinary successfully", result);
        return result;

    } catch (error) {
        throw new ApiError(500,"failed to Remove Asset from cloudinary",error)
    }
}
const uploadVideoToCloudinary = async(videoFilelocalPath) => {
    if(!videoFilelocalPath){
        throw new ApiError(400,"failed to fetch video file from local path")
    }
    if (!fs.existsSync(videoFilelocalPath)) {
        throw new ApiError(400,"File does not exist at path:", videoFilelocalPath);
    }
    try {
        const video = await cloudinary.uploader.upload_large(videoFilelocalPath, {
            resource_type:"video",
        });
        console.log("video is uploaded on cloudinary", video.url);
        return video;
    } catch (error) {
        throw new ApiError(500,"failed to upload video to cloudinary",error)
    } finally {
        fs.unlinkSync(videoFilelocalPath);
    }
}
const deleteVideoFromCloudinary = async(videoUrl)=>{
    if(!videoUrl){
        throw new ApiError(400,"failed to fetch video url from DB")
    }
    try {
        if (!videoUrl.includes("/upload/")) {
            throw new Error("Invalid Cloudinary URL");
        }
        const publicId = videoUrl
            .split("/upload/")[1]
            .replace(/\.[^/.]+$/, ""); // remove extension safely
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("video is deleted from cloudinary", result);
        return result;
    } catch (error) {
        throw new ApiError(500,"failed to delete video from cloudinary",error)
    }
}

export {
    uploadOnCloudinary , 
    deleteFromCloudnary, 
    uploadVideoToCloudinary, 
    deleteVideoFromCloudinary
};