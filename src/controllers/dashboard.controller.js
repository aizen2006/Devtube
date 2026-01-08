import mongoose from "mongoose"
import {Video} from "../models/video.models.js"
import {Subscription} from "../models/subscription.models.js"
import {Like} from "../models/like.models.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const channelId = req.user._id
    try {
        const totalVideos = await Video.countDocuments({owner: channelId})
        const totalSubscribers = await Subscription.countDocuments({channel: channelId})
        const totalLikes = await Like.countDocuments({video: {owner: channelId}})
        return res.status(200).json(new ApiResponse(200, {totalVideos, totalSubscribers, totalLikes} , "Channel stats fetched successfully"))
    } catch (error) {
        throw new ApiError(400, error?.message || "Failed to fetch channel stats")
    }
})

const getChannelVideos = asyncHandler(async (req, res) => {
    const channelId = req.user._id
    try {
        const videos = await Video.find({owner: channelId})
        return res.status(200).json(new ApiResponse(200, videos , "Channel videos fetched successfully"))
    } catch (error) {
        throw new ApiError(400, error?.message || "Failed to fetch channel videos")
    }
})

export {
    getChannelStats, 
    getChannelVideos
    }