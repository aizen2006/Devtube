import asyncHandler from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandler (async (req, _ , next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if(!token) {
            throw new ApiError (402,"Access denied. No token provided.")
        }
    
        const decoddedInfoToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decoddedInfoToken?._id).select("-password -refreshToken")
        if(!user){
            throw new ApiError(401, "Invalid token. User not found.")
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid or expired token.")
    }
}); 