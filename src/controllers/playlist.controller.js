import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.models.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {

    const {name, description} = req.body
    try {
        const playlist = await Playlist.create({name:name , description:description, owner: req.user._id})
        return res.status(201).json(new ApiResponse(201, playlist , "Playlist created successfully"))
    } catch (error) {
        throw new ApiError(400, error?.message || "Failed to create playlist")
    }


})

const getUserPlaylists = asyncHandler(async (req, res) => {

    const {userId} = req.params
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user id")
    }
    try {
        const playlists = await Playlist.find({owner: mongoose.Types.ObjectId(userId)})
        return res.status(200).json(new ApiResponse(200, playlists , "User playlists fetched successfully"))
    } catch (error) {
        throw new ApiError(400, error?.message || "Failed to get user playlists")
    }

})

const getPlaylistById = asyncHandler(async (req, res) => {

    const {playlistId} = req.params
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist id")
    }
    try {
        const playlist = await Playlist.findById(mongoose.Types.ObjectId(playlistId))
        return res.status(200).json(new ApiResponse(200, playlist , "Playlist fetched successfully"))
    } catch (error) {
        throw new ApiError(400, error?.message || "Failed to get playlist by id")
    }

})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid playlist id or video id")
    }
    try {
        const playlist = await Playlist.findByIdAndUpdate(
            mongoose.Types.ObjectId(playlistId),
            {
                $addToSet: { videos: mongoose.Types.ObjectId(videoId) } // prevents duplicates
            }, {new: true, runValidators: true})
        return res.status(200).json(new ApiResponse(200, playlist , "Video added to playlist successfully"))
    } catch (error) {
        throw new ApiError(400, error?.message || "Failed to add video to playlist")
    }
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid playlist id or video id")
    }
    try {
        const playlist = await Playlist.findByIdAndUpdate(
            mongoose.Types.ObjectId(playlistId), 
            {
                $pull: { videos: mongoose.Types.ObjectId(videoId) } // removes the video from the playlist
            }, {new: true, runValidators: true})
        return res.status(200).json(new ApiResponse(200, playlist , "Video removed from playlist successfully"))
    } catch (error) {
        throw new ApiError(400, error?.message || "Failed to remove video from playlist")
    }

})

const deletePlaylist = asyncHandler(async (req, res) => {

    const {playlistId} = req.params
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist id")
    }
    try {
        await Playlist.findByIdAndDelete(mongoose.Types.ObjectId(playlistId))
        return res.status(200).json(new ApiResponse(200, null , "Playlist deleted successfully"))
    } catch (error) {
        throw new ApiError(400, error?.message || "Failed to delete playlist")
    }
})

const updatePlaylist = asyncHandler(async (req, res) => {

    const {playlistId} = req.params
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist id")
    }
    const {name, description} = req.body
    try {
        const playlist = await Playlist.findByIdAndUpdate(
            mongoose.Types.ObjectId(playlistId),
            {name: name, description: description},
            {new: true, runValidators: true})
        return res.status(200).json(new ApiResponse(200, playlist , "Playlist updated successfully"))
    } catch (error) {
        throw new ApiError(400, error?.message || "Failed to update playlist")
    }
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}