import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.models.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const {content} = req.body
    try {
        const tweet = await Tweet.create({content: content, owner: req.user._id})
        return res.status(201).json(new ApiResponse(201, tweet , "Tweet created successfully"))
    } catch (error) {
        throw new ApiError(400, error?.message || "Failed to create tweet")
    }
})

const getUserTweets = asyncHandler(async (req, res) => {
    const {userId} = req.params
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user id")
    }
    try {
        const tweets = await Tweet.find({owner: mongoose.Types.ObjectId(userId)})
        return res.status(200).json(new ApiResponse(200, tweets , "User tweets fetched successfully"))
    } catch (error) {
        throw new ApiError(400, error?.message || "Failed to get user tweets")
    }
})

const updateTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet id")
    }
    const {content} = req.body
    try {
        const tweet = await Tweet.findByIdAndUpdate(mongoose.Types.ObjectId(tweetId), {content: content}, {new: true, runValidators: true})
        return res.status(200).json(new ApiResponse(200, tweet , "Tweet updated successfully"))
    } catch (error) {
        throw new ApiError(400, error?.message || "Failed to update tweet")
    }
})

const deleteTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet id")
    }
    try {
        await Tweet.findByIdAndDelete(mongoose.Types.ObjectId(tweetId))
        return res.status(200).json(new ApiResponse(200, null , "Tweet deleted successfully"))
    } catch (error) {
        throw new ApiError(400, error?.message || "Failed to delete tweet")
    }
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}