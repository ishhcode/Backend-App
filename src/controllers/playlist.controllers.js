import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist
    if(!name || !description){
        throw new ApiError(400,"name and description required!")
    }
    const playlist = await Playlist.create(
        {
            name :name,
            description: description,
            owner: req.user?._id
        }
    )
    if(!playlist){
        throw new ApiError(500,"something went wrong while creating playlist!")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,playlist,"playlist created successfully!")
    )

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if(!isValidObjectId(userId)){
        throw new ApiError(400,"Invalid User ID")
    }
    const userPlaylist = await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $project: {
                name:1,
                description:1,
                createdAt:1,
                updatedAt:1
            }
        }
    ])

    return res.status(200)
    .json(
        new ApiResponse(200,userPlaylist,"user playlist fetched successfully!")
    )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if(!isValidObjectId(playlistId)){
         throw new ApiError(400,"playlist is not valid!")
    }
    
    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404,"Playlist does not exist.")
    }
    return res.status(200)
    .json(new ApiResponse(200,playlist,"required playlist fetched!"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400,"playlistId , validId are not valid!")
    }
    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(404,"Playlist does not exist.")
    }
    if(playlist.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "Unauthorized to perform this action")
    }

    // const index = playlist.videos.indexOf(videoId);
    // if(index === -1){
    //    playlist.videos.push(videoId) 
    //    playlist = await playlist.save({validateBeforeSave: false})
    // }else{
    //   throw new ApiError(404,"Already exists in the list");
    // }
    if(playlist.videos.includes(videoId)) {
        throw new ApiError(409, "This Video is already in the playlist")
    }
    const addtoPlaylist = await Playlist.updateOne(
        { _id: new mongoose.Types.ObjectId(playlistId) },
        { $push: { videos: videoId } }
      );

    return res.status(200)
    .json(new ApiResponse(
        200,addtoPlaylist,"video added to playlist successfully!"
    ))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400,"playlistId , validId are not valid!")
    }
    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(404,"Playlist does not exist.")
    }
    if(playlist.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "Unauthorized to perform this action")
    }
    // const index = playlist.videos.indexOf(videoId);
    // if(index !== -1){
    //     playlist.video.splice(index, 1); // Remove videoId from the playlist
    //     playlist = await playlist.save({validateBeforeSave: false});
    // }
    const removeVideoFromPlaylistRequest = await Playlist.updateOne(
        {
          _id: new mongoose.Types.ObjectId(playlistId),
        },
        { $pull: { videos: new mongoose.Types.ObjectId(videoId) } }
      );
    return res.status(200)
    .json(new ApiResponse(200,removeVideoFromPlaylistRequest,"video removed successfully!"))

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"playlistId are not valid!")
    }
    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404,"Playlist does not exist.")
    }

    if(playlist.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "Unauthorized to perform this action")
    }
    await Playlist.findOneAndDelete(playlistId)

    
    return res.status(200)
    .json(new ApiResponse(200,{},"playlist deleted successfully!"))


})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"playlistId are not valid!")
    }
    if(!name && !description){
        throw new ApiError(400,"name and description are required!")
    }
    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404,"Playlist does not exist.")
    }

    if(playlist.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "Unauthorized to perform this action")
    }
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
           $set: {
              name,description
           }
        },
        {new: true}//returns new updated values
    )

    return res.status(200)
    .json(new ApiResponse(200,updatedPlaylist,"playlist updated successfully!"))
    
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