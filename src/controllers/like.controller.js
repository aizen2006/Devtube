import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.models.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    try{
        const like = await Like.findOne({video: mongoose.Types.ObjectId(videoId), likedBy: req.user._id})
        if(like){
            await Like.findByIdAndDelete(like._id)
            return res.status(200).json(new ApiResponse(200, null , "Video unliked successfully"))
        }else{
            await Like.create({video: mongoose.Types.ObjectId(videoId), likedBy: req.user._id})
            return res.status(200).json(new ApiResponse(200, null , "Video liked successfully"))
        }
    }catch(error){
        throw new ApiError(400, error?.message || "Failed to toggle video like")
    }

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid comment id")
    }
    try {
        const like = await Like.findOne({comment: mongoose.Types.ObjectId(commentId), likedBy: req.user._id})
        if(like){
            await Like.findByIdAndDelete(like._id)
            return res.status(200).json(new ApiResponse(200, null , "Comment unliked successfully"))
        }else{
            await Like.create({comment: mongoose.Types.ObjectId(commentId), likedBy: req.user._id})
            return res.status(200).json(new ApiResponse(200, null , "Comment liked successfully"))
        }
    } catch (error) {
        throw new ApiError(400, error?.message || "Failed to toggle comment like")
    }


})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet id")
    }
    try {
        const like = await Like.findOne({tweet: mongoose.Types.ObjectId(tweetId), likedBy: req.user._id})
        if(like){
            await Like.findByIdAndDelete(like._id)
            return res.status(200).json(new ApiResponse(200, null , "Tweet unliked successfully"))
        }else{
            await Like.create({tweet: mongoose.Types.ObjectId(tweetId), likedBy: req.user._id})
            return res.status(200).json(new ApiResponse(200, null , "Tweet liked successfully"))
        }
    } catch (error) {
        throw new ApiError(400, error?.message || "Failed to toggle tweet like")
    }
})

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id
    try {
        const likedVideos = await Like.find({likedBy: userId}).populate("video")
        return res.status(200).json(new ApiResponse(200, likedVideos , "Liked videos fetched successfully"))
    } catch (error) {
        throw new ApiError(400, error?.message || "Failed to get liked videos")
    }
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}