import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import {Video} from "../models/video.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const checkOwner = async(videoId,id)=>{
    const video = await Video.findById(videoId);

    if(video?.owner !== id){
        return false;
    }
    return true;


}

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    if(!title || !description){
        throw new ApiError(404,"title and description are required!")
    }
    const videoLocalPath = req.files?.videoFile[0]?.path

    if(!videoLocalPath){
        throw new ApiError(500,"No video uploaded!")
    }
    const thumbnailLocalPath = req.files?.thumbnail[0].path
    if(!thumbnailLocalPath){
        throw new ApiError(500,"No thumbnail uploaded!")
    }

    const video = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    if(!video){
        throw new ApiError(500,"Something went wrong while uploading on cloudnary")
    }
    console.log(video)
    if(!thumbnail){
        throw new ApiError(500,"Something went wrong while uploading on cloudnary")
    }

    const createdVideo = await Video.create({
        videoFile: video.url,
        thumbnail: thumbnail.url,
        title,
        description,
        duration:video.duration,
        owner:req.user._id
    })

    if(!createdVideo){
        throw new ApiError(500,"video not created")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,createdVideo,"video published successfully!")
    )

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if(!videoId){
        throw new ApiError(400,"videoId is required!")
    }
    const video = await Video.findById(videoId)
    if(!video || !video?.isPublished){
        throw new ApiError(400,"video not found!")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,video, "video fetched successfully!"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    if(!videoId){
        throw new ApiError(400,"Videoid required!")
    }
    if(!checkOwner(videoId,req.user?._id)) {
        throw new ApiError(404, "Unauthorized Access")
    }
    const {title,description} = req.body
    if(!title || !description){
        throw new ApiError(400,"title and description are required!")
    }
    const thumbnailLocalPath = req.file?.path;

    if(!thumbnailLocalPath){
        console.log('No file uploaded');
        return new ApiResponse(500,"No thumbnail uploaded");
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if(!thumbnail?.url){
        throw new ApiError(500,"Failed to save image on cloudinary!");
    }
     
    const video = await Video.findByIdAndUpdate(videoId,
        {
            $set:{
                thumbnail:thumbnail.url,
                title,
                description
            }
        },
        {new:true}
    )

    if(!video){
        throw new ApiError(500,"Something went wrong while updating the details")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,video,"video updated successfully!")
    )



})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    // Check if videoId is provided

    if (!videoId) {
        throw new ApiError(400, "videoId is required!");
    }
    if(!checkOwner(videoId,req.user?._id)) {
        throw new ApiError(404, "Unauthorized Access")
    }
    // Find the video by its ID in the database
    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(404, "Video not found")
    }
    await Video.findByIdAndDelete(video)
    return res.status(200)
    .json(
        new ApiResponse(200,{},"video deleted Successfully!")
    )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!videoId){
        throw new ApiError(400,'Invalid video Id')
    }
    if(!checkOwner(videoId?.owner,req.user?._id)){
        throw new ApiError(300,'Unauthorized Access')
    }

    const video = await Video.findById(videoId);
    const updateVideo = await Video.findByIdAndUpdate(videoId,
        {
            $set:{
                isPublished:!video.isPublished
            }
        },
        {new:true}
    )

    if(!updateVideo){
        throw new ApiError(500,"Something went wrong while updating the details")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,updateVideo,"PublishStatus of the video  is toggled successfully"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}