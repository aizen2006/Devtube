import mongoose from "mongoose"
import {Comment} from "../models/comment.models.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
const getVideoComments = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    try {
        const comments = await Comment.paginate ({video: mongoose.Types.ObjectId(videoId)}, {page, limit, sort: {createdAt: -1}})
        return res.status(200).json(new ApiResponse(200, comments , "Comments fetched successfully"))
    } catch (error) {
        throw new ApiError(400, error?.message || "Failed to fetch comments")
    }
})

const addComment = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {content} = req.body
    try {
        const comment = await Comment.create({
            content,
            video: mongoose.Types.ObjectId(videoId),
            owner: req.user._id
        })
        return res.status(201).json(new ApiResponse(201, comment , "Comment added successfully"))
    } catch (error) {
        throw new ApiError(400, error?.message || "Failed to add comment")
    }
})

const updateComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const {content} = req.body
    try {
        const comment = await Comment.findByIdAndUpdate(mongoose.Types.ObjectId(commentId), {content}, {new: true, runValidators: true})
        return res.status(200).json(new ApiResponse(200, comment , "Comment updated successfully"))
    } catch (error) {
        throw new ApiError(400, error?.message || "Failed to update comment")
    }
})

const deleteComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    try {
        await Comment.findByIdAndDelete(mongoose.Types.ObjectId(commentId))
        return res.status(200).json(new ApiResponse(200, null , "Comment deleted successfully"))
    } catch (error) {
        throw new ApiError(400, error?.message || "Failed to delete comment")
    }
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
    }