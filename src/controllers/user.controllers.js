import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt  from "jsonwebtoken";
import { trusted } from "mongoose";

const generateAccessandRefreshTokens = async(userId) =>{
   try {
      const user = await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      user.refreshToken = refreshToken
      await user.save({ validateBeforeSave: false })

      return { accessToken, refreshToken }

   } catch (error) {
      throw new ApiError(500, "Something went wrong while generating refresh and access tokens")

   }

}



const registerUser = asyncHandler(async (req, res) => {
   const { fullName, email, username, password } = req.body
   console.log("email:", email);

   if (
      [fullName, email, username, password].some((field) =>
         field?.trim() === "")
   ) {
      throw new ApiError(400, "All fields are required")
   }

   const existedUser = await User.findOne({
      $or: [{ username }, { email }]
   })

   if (existedUser) {
      throw new ApiError(409, " User with email or username already exists.")
   }
   const avatarLocalPath = req.files?.avatar[0]?.path;
   //const coverImageLocalPath = req.files?.coverImage[0]?.path;

   let coverImageLocalPath;
   if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
      coverImageLocalPath = req.files.coverImage[0].path
   }

   if (!avatarLocalPath) {
      throw new ApiError(400, "avatar is required")
   }

   const avatar = await uploadOnCloudinary(avatarLocalPath)
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)

   if (!avatar) {
      throw new ApiError(400, "avatar is required")
   }

   const user = await User.create({
      fullName,
      email,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      password,
      username: username.toLowerCase()
   })
   const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
   )
   if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering the user!")
   }

   return res.status(201).json(
      new ApiResponse(200, createdUser, "user registered successfully!")
   )


})
const loginUser = asyncHandler(async (req, res) => {
   //req body->data
   //username or email
   //find the user
   //password check
   //access and refresh token
   //send cookie
   //response
   const { username, email, password } = req.body

   // if(!(username || email)) if we want to check for any one of them
   if (!username && !email) {
      throw new ApiError(400, "username or email is required")
   }
   const user = await User.findOne({
      $or: [{ username }, { email }]
   })

   if (!user) {
      throw new ApiError(404, "User does not exist")
   }

   const isPasswordValid = await user.isPasswordCorrect(password)
   if (!isPasswordValid) {
      throw new ApiError(401, "Invalid User Credentials!")
   }

   const { accessToken, refreshToken } = await generateAccessandRefreshTokens(user._id)

   const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
   //can only be modifies by server 
   const options = {
      httpOnly: true,
      secure: true
   }

   return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
         new ApiResponse(200,
            {
               user:loggedInUser, accessToken, refreshToken
            },
            "User logged in Successfully!"
         )
      )

})

const logoutUser = asyncHandler(async(req,res)=>{
   await User.findByIdAndUpdate(
      req.user._id,
      {
         $set: {
            refreshToken: undefined
         }
      },
      {new: true}
   )
   const options = {
      httpOnly: true,
      secure: true
   }
    
   return res
   .status(200)
   .clearCookie("accessToken",options)
   .clearCookie("refreshToken",options)
   .json(new ApiResponse(200,"","User logged out Successfully!"))

})

const refreshAccessToken = asyncHandler(async(req, res)=>{
   const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

   if(incomingRefreshToken){
      throw new ApiError(401, "Unauthorised request")
   }
   try {
      const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SCERET)
   
      const user = await User.findById(decodedToken?._id)
      if(!user){
         throw new ApiError(401, "Invalid Refresh Token")
      }
   
      if(incomingRefreshToken !== user.refreshToken){
         throw new ApiError(401, "Refresh Token is expired or used")
      }
   
      const options = {
         httpOnly:true,
         secure: true
      }
      const {accessToken, newRefreshToken} = await generateAccessandRefreshTokens(user._id)
   
      return res
      .status(200)
      .cookie("accessToken", accessToken,options)
      .cookie("refreshToken", newRefreshToken,options)
      .json(
         new ApiResponse(
            200,
            {accessToken, refreshToken: newRefreshToken},
            "Access Token Refreshed"
         )
      )
   
   } catch (error) {
      throw new ApiError(401,error?.message ||"Invalid Refresh Token!")
      
   }
})

export { 
   registerUser,
   loginUser,
   logoutUser,
   refreshAccessToken
};