import {User} from '../models/user.models.js';
import { apiResponse } from "../utils/api-Response.js";
import {apiError} from "../utils/api-Error.js";
import {asynchandler} from "../utils/asyncHandler.js";
import {emailVerificationMailgenContent,forgotPasswordMailgenContent,sendEmail} from "../utils/mail.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const generateAccessandRefreshToken = async (userId)=>{

         try{
            const user = await User.findById(userId)
            const accessToken = user.generateAccessToken()
            const refreshToken = user.generateRefreshToken()

            user.refreshToken = refreshToken
            await user.save({validateBeforeSave: false})

            return {accessToken,refreshToken};
         }
         catch(error){
               throw new apiError(500,"something went wrong accessing tokens")  
         }

         
            
}

const registerUser = asynchandler(async (req,res)=>{
             
        const{email,username,password} = req.body;

         const ExistedUser = await User.findOne({
                 $or: [{username}, 
                        
                        {email}  
                        
                 ] 
                   
         })


         if(ExistedUser){
                throw new apiError(409,"Username or Email already used",[])
         }
         
        const user = await User.create({
                 email,
                 password,
                 username,
                 isEmailVerified: false
         })


         const {unHashedToken,hashedToken,tokenExpiry} = user.generateTemporaryToken();

          user.emailVerificationToken = hashedToken
          user.emailVerificationExpiry = tokenExpiry

         await  user.save({validateBeforeSave: false})


        await sendEmail({
         email: user?.email,
         subject: "please verify your email",
         mailgenContent: emailVerificationMailgenContent(
                user.username,
                `${process.env.FRONTEND_URL}/verify-email/${unHashedToken}`,
         ),
       });

       const createdUser = await User.findById(user._id).select(
         "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
       );

    if(!createdUser){
         throw new apiError(404,"something went wrong")
    }

    return res
  .status(201)
  .json(
    new apiResponse(
      201,
      { user: createdUser },
      "User registered successfully and verification email has been sent on your email",
    ),
  );

})


const loginUser = asynchandler(async (req,res)=> {
         const {email,username,password} = req.body;

         if(!email){
             throw new apiError(400,"email is required")
         }
         
         const user = await User.findOne({email});

         if(!user){
            throw new apiError(400,"user does not exist")

         }
         
         const isPassword = await user.isPasswordCorrect(password)

         if(!isPassword){
            throw new apiError(400,"Invalid Password")
         }
         
         
         if(!user.isEmailVerified){
            throw new apiError(403,"Email is not verified. Please verify your email first")
         }

         const {accessToken,refreshToken} = await generateAccessandRefreshToken(user._id)
         
         const loggedInUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry")

         if(!loggedInUser){
           throw new apiError(400,"something went wrong while login")
         }

         const options = {
            httpOnly: true,
            secure:  true
         }

        return res
         .status(200)
         .cookie("accessToken",accessToken,options)
         .cookie("refreshToken",refreshToken,options)
         .json(
            new apiResponse(200,
               {user: loggedInUser,
                accessToken,
                refreshToken
                 
               },
                "User logged in successfully")
              )

})

const logoutUser = asynchandler(async (req,res)=>{
          await User.findByIdAndUpdate(req.user._id,
              {
                $set: {
                     refreshToken: "",
                }
              },
              {
                new: true
              }
          )

          const options = {
               httpOnly: true,
               secure: true,
          }

         return res
          .status(200)
          .clearCookie("accessToken",options)
          .clearCookie("refreshToken",options)
          .json(
               new apiResponse(200,{},"User Logged out Successfully")
          )
          



})

const getCurrentUser = asynchandler(async (req,res)=> {
       return res
              .status(200)
              .json(
                   new apiResponse(
                    200,
                    {currentuser: req.user},
                    "current user fetched successfully"
                )
              )
})

const verifyEmail = asynchandler(async (req,res) => {
            const {verificationToken} = req.params //takes unhashed token(dynamic component) from url
            if(!verificationToken){
               throw new apiError(400,"Email verification token is missing")

            }

            const hashedToken = crypto
                                .createHash("sha256")
                                .update(verificationToken)
                                .digest("hex")
              
            const user = await User.findOne({
                    emailVerificationToken: hashedToken,
                    emailVerificationExpiry: {$gt: Date.now()}
            })

            if(!user){
                 throw new apiError(400,"Token is invalid or expired")
            }

            user.emailVerificationToken = undefined;
            user.emailVerificationExpiry = undefined

            user.isEmailVerified = true;
           await user.save({validateBeforeSave: false})

           return res
                  .status(200)
                  .json(new apiResponse(
                       200,
                       {isEmailVerified: true},
                       "email verified successfully"
                  ))
             

})

const resendEmailVerification = asynchandler(async (req,res) => {
        const user = await User.findById(req.user._id);
        if(!user){
             throw new apiError(404,"User do not exist")
        }

             if(user.isEmailVerified){
                throw new apiError(409,"Email already verified")


             }

           const {unHashedToken,hashedToken,tokenExpiry} = user.generateTemporaryToken();

          user.emailVerificationToken = hashedToken
          user.emailVerificationExpiry = tokenExpiry

         await  user.save({validateBeforeSave: false})


        await sendEmail({
         email: user?.email,
         subject: "please verify your email",
         mailgenContent: emailVerificationMailgenContent(
                user.username,
                `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unHashedToken}`,
         ),
       });

  res.status(200)
      .json(new apiResponse(
            200,
            {},
            "Mail has been sent to your Email Id"
      ));
        
        
})

const refreshAccessToken = asynchandler(async (req,res)=> {
          const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

          if(!incomingRefreshToken){
              throw new apiError(401,"Unauthorized access")
          }
 
          try{
                 const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
                 const user = await User.findById(decodedToken._id)

                 if(!user){
                   throw new apiError(401,"Invalid Refresh Token")
                 }

                 if(incomingRefreshToken!==user.refreshToken){
                     throw new apiError(401,"Invalid Refresh Token")
                 }
                
                 
                
                 const options = {
                    httpOnly: true,
                    secure: true,
                 }

                 const {accessToken,refreshToken} = await generateAccessandRefreshToken(user._id)

                 

               return res
                      .status(200)
                      .cookie("accessToken",accessToken,options)
                      .cookie("refreshToken",refreshToken,options)
                      .json(new apiResponse(
                             200,
                             {accessToken,refreshToken},
                             "Access token refreshed"
                      ))


          }
          catch(error){
                 throw new apiError(401,"Invalid refresh token")
          }

          
          
})


const forgotPasswordRequest = asynchandler(async (req,res) => {
           const {email} = req.body;

           const user = await User.findOne({email});

           if(!user){
              throw new apiError(404,"User does not exist")

           }

           const {unHashedToken,hashedToken,tokenExpiry} = user.generateTemporaryToken();

           user.forgotPasswordToken = hashedToken;
           user.forgotPasswordExpiry = tokenExpiry;

          await user.save({validateBeforeSave: false});
          

            await sendEmail({
         email: user?.email,
         subject: "Reset Password",
         mailgenContent: forgotPasswordMailgenContent(
                user.username,
                `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${unHashedToken}`,
         )
})

         return res
                .status(200)
                .json(new apiResponse(
                   200,
                   {},
                   "Password Reset Mail has been sent to your mail ID"
                )
                  
                  
                )



})

const resetForgotPassword = asynchandler(async (req,res)=>{
        const {resetToken} = req.params
        const {newPassword} = req.body

        let hashedToken = crypto
                          .createHash("sha256")
                          .update(resetToken)
                          .digest("hex")
        
        const user = await User.findOne({
                       forgotPasswordToken: hashedToken,
                       forgotPasswordExpiry: {$gt: Date.now()}
        })

        if(!user){
            throw new apiError(400,"Token invalid or expired")
        }

        user.forgotPasswordToken = undefined
        user.forgotPasswordExpiry = undefined


        user.password = newPassword
        await user.save({validateBeforeSave: false})
        return res
               .status(200)
               .json(new apiResponse(
                 200,
                 {},
                 "Password reset successfully"
               )
                   
               )

})

const changeCurrentPassword = asynchandler(async (req,res)=> {
         const {oldPassword,newPassword} = req.body;
         
         const user = await User.findById(req.user?._id)

         if(!user){
             throw new apiError(404,"User not found")
         }

         const isPasswordValid = await user.isPasswordCorrect(oldPassword)

         if(!isPasswordValid){
              throw new apiError(400,"Invalid Old Password")
         }

         user.password = newPassword;
         await user.save({validateBeforeSave: false})

         return res
                .status(200)
                .json(new apiResponse(
                     200,
                     {},
                     "Password changed successfully"
                ))
})

export {registerUser,loginUser,logoutUser,getCurrentUser,verifyEmail,resendEmailVerification,
        refreshAccessToken,forgotPasswordRequest,resetForgotPassword,changeCurrentPassword}