import mongoose, {isValidObjectId} from "mongoose"
import { Subscription } from "../models/subscriptions.models.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel id")
    }
    try{
        const subscription = await Subscription.findOne({subscriber: req.user._id, channel: mongoose.Types.ObjectId(channelId)})
        if(subscription){
            await Subscription.findByIdAndDelete(subscription._id)
            return res.status(200).json(new ApiResponse(200, null , "Subscription deleted successfully"))
        }else{
            await Subscription.create({subscriber: req.user._id, channel: mongoose.Types.ObjectId(channelId)})
            return res.status(200).json(new ApiResponse(200, null , "Subscription created successfully"))
        }
    }catch(error){
        throw new ApiError(400, error?.message || "Failed to toggle subscription")
    }
    
})

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel id")
    }
    try {
        const subscribers = await Subscription.find({channel: mongoose.Types.ObjectId(channelId)})
        return res.status(200).json(new ApiResponse(200, subscribers , "User channel subscribers fetched successfully"))
    } catch (error) {
        throw new ApiError(400, error?.message || "Failed to get user channel subscribers")
    }
})

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if(!isValidObjectId(subscriberId)){
        throw new ApiError(400, "Invalid subscriber id")
    }
    try {
        const subscribedChannels = await Subscription.find({subscriber: mongoose.Types.ObjectId(subscriberId)})
        return res.status(200).json(new ApiResponse(200, subscribedChannels , "Subscribed channels fetched successfully"))
    } catch (error) {
        throw new ApiError(400, error?.message || "Failed to get subscribed channels")
    }
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}