import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import 'dotenv/config';


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

export {uploadOnCloudinary};