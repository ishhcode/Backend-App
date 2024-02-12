import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";



//res is replced with '_' intentionally as it is not being used in the content.
export const verifyJWT = asyncHandler(async(req, _,next)=>{
    try {
        const token = req.cookies?.accessToken || req.Header("Authorizarion")?.replace("Bearer ","")
    
         if(!token){
            throw new ApiError(401,"Unauthorized Request")
         }
    
         const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SCERET)
    
         const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
         if(!user){
            throw new ApiError(401,"Invalid access Token!")
         }
         req.user = user
         next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token!")
        
    }
})