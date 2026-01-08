import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.models.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadVideoToCloudinary, deleteVideoFromCloudinary, uploadOnCloudinary, deleteFromCloudnary} from "../utils/fileUpload.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user id")
    }
    try {
        const videos = await Video.paginate({query, sortBy, sortType, userId}, {page, limit})
        return res.status(200).json(new ApiResponse(200, videos , "Videos fetched successfully"))
    } catch (error) {
        throw new ApiError(400, error?.message || "Failed to fetch videos")
    }
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    if(!title || !description){
        throw new ApiError(400, "Title and description are required")
    }
    const videoFilelocalPath = req.files?.videoFile[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path
    if(!videoFilelocalPath || !thumbnailLocalPath){
        throw new ApiError(400, "Video file and thumbnail are required")
    }
    try {
    const uploadedVideo = await uploadVideoToCloudinary(videoFilelocalPath)
    const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    if(!uploadedVideo || !uploadedThumbnail){
        throw new ApiError(500, "Failed to upload video or thumbnail")
    }
    const video = await Video.create({title: title, description: description, owner: req.user._id, videoFile: uploadedVideo.url, thumbnail: uploadedThumbnail.url})
    return res.status(201).json(new ApiResponse(201, video , "Video created successfully"))
    } catch (error) {
        throw new ApiError(500, error?.message || "Failed to create video")
    }
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id")
    }
    try {
        const video = await Video.findById(videoId)
        return res.status(200).json(new ApiResponse(200, video , "Video fetched successfully"))
    } catch (error) {
        throw new ApiError(400, error?.message || "Failed to get video")
    }
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id")
    }
    const { title, description } = req.body
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path
    if(!thumbnailLocalPath){
        throw new ApiError(400, "Thumbnail is required")
    }
    try {
        const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath)
        if(!uploadedThumbnail){
            throw new ApiError(500, "Failed to upload thumbnail")
        }
        const video = await Video.findById(videoId)
        if(!video){
            throw new ApiError(404, "Video not found")
        }
        const oldThumbnail = video.thumbnail
        if(oldThumbnail){
            await deleteFromCloudnary(oldThumbnail)
        }
        const updatedVideo = await Video.findByIdAndUpdate(videoId, {title: title, description: description, thumbnail: uploadedThumbnail.url}, {new: true, runValidators: true})
        return res.status(200).json(new ApiResponse(200, updatedVideo , "Video updated successfully"))
    } catch (error) {
        throw new ApiError(500, error?.message || "Failed to update video")
    }
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id")
    }
    try {
        const video = await Video.findById(videoId)
        if(!video){
            throw new ApiError(404, "Video not found")
        }
        const oldVideo = video.videoFile
        if(oldVideo){
            await deleteVideoFromCloudinary(oldVideo)
        }
        const oldThumbnail = video.thumbnail
        if(oldThumbnail){
            await deleteFromCloudnary(oldThumbnail)
        }
        await Video.findByIdAndDelete(videoId)
        return res.status(200).json(new ApiResponse(200, null , "Video deleted successfully"))
    }catch(error){
        throw new ApiError(500, error?.message || "Failed to delete video")
    }
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id")
    }
    try {
        const video = await Video.findById(videoId)
        if(!video){
            throw new ApiError(404, "Video not found")
        }
        if(video.isPublished){
            await Video.findByIdAndUpdate(videoId, {isPublished: false})
            return res.status(200).json(new ApiResponse(200, null , "Video unpublished successfully"))
        }else{
            await Video.findByIdAndUpdate(videoId, {isPublished: true})
            return res.status(200).json(new ApiResponse(200, null , "Video published successfully"))
        }
    } catch (error) {
        throw new ApiError(500, error?.message || "Failed to toggle publish status")
    }
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}