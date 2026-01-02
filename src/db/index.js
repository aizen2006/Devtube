import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import 'dotenv/config';

export const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`MongoDB connected successfully to host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MongoDB connection failed");
        process.exit(1);
        
    }
}
export default connectDB