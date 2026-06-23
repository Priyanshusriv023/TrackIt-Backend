import {User} from "../models/user.models.js";
import {apiError} from "../utils/api-Error.js";
import {asynchandler} from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const verifyJWT = asynchandler(async (req,res,next)=>{
         const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")//this extra space after bearer is neccesary

         if(!token){
              throw new apiError(401,"unauthorized request")

         }

         try{
                const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

                const user = await User.findById(decodedToken._id)
                                      .select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry")

                 if(!user){
                     throw new apiError(401,"unauthorized request, user does not exist")
                 }
                 req.user = user;
                    next()
         }
         catch(error){
             throw new apiError(401,error?.message || "invalid access token")
         }
        

})