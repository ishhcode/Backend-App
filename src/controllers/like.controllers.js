import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

import {User} from "../models/user.models.js"


const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid videoId")
    }
    
    // const video = await Video.findById(videoId);

    // if(!video){
    //     throw new ApiError(404,"video not found")
    // }

    const isLiked = await Like.findOne({video: videoId});

    if(!isLiked){
        // create a new one
        const Liked = await Like.create({
            video : videoId,
            likedBy: req.user?._id
        })
        return res
        .status(200)
        .json(new ApiResponse(200,Liked,"Liked Successfully"))
    }
    else{
        await Like.findByIdAndDelete(isLiked._id)

        return res
        .status(200)
        .json(new ApiResponse(200,{},"UnLiked Successfully"))
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"Invalid commentId")
    }
    
    // const video = await Video.findById(videoId);

    // if(!video){
    //     throw new ApiError(404,"video not found")
    // }

    const isLiked = await Like.findOne({comment: commentId});

    if(!isLiked){
        // create a new one
        const Commented = await Like.create({
            comment : commentId,
            likedBy: req.user?._id
        })
        return res
        .status(200)
        .json(new ApiResponse(200,Commented,"Liked Successfully"))
    }
    else{
        await Like.findByIdAndDelete(isLiked._id)

        return res
        .status(200)
        .json(new ApiResponse(200,{},"UnLiked Successfully"))
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid tweetId")
    }
    
    // const video = await Video.findById(videoId);

    // if(!video){
    //     throw new ApiError(404,"video not found")
    // }

    const isLiked = await Like.findOne({tweet: tweetId});

    if(!isLiked){
        // create a new one
        const Tweeted = await Like.create({
            tweet : tweetId,
            likedBy: req.user?._id
        })
        return res
        .status(200)
        .json(new ApiResponse(200,Tweeted,"Liked Successfully"))
    }
    else{
        await Like.findByIdAndDelete(isLiked._id)

        return res
        .status(200)
        .json(new ApiResponse(200,{},"UnLiked Successfully"))
    }

}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user?._id

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "This user id is not valid")
    }

    // find user in database 
    const user = await User.findById(userId)
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const likedVideos = await Like.aggregate([
        {
            $match:{
                video: {
                    $exists: true,
                },
                likedBy: new mongoose.Types.ObjectId(userId),
            }
        },
        {
            $lookup: {
              from: 'videos',
              localField: 'video',
              foreignField: "_id",
              as: "likedVideos",
              pipeline:[
                {
                    $project:{
                        videoFile:1,
                        thumbnail:1,
                        views:1,
                        duration:1,
                        title:1,
                        description:1
                    }
                }
              ]
            }
        },
        {
            $addFields:{
                video:{
                    $first:"$likedVideos"
                }
            }
        },
        {
            $project:{
                video:1,
            }
        }
    ])

    
    return res
    .status(200)
    .json(new ApiResponse(200, likedVideos, "liked videos!"));
    
})
export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}