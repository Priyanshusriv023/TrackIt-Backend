import mongoose,{Schema} from "mongoose"
import bcrypt from "bcrypt"
import crypto from "crypto"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
         avatar: {
             type : {
                 url: String,
                 localpath: String,
             },

             default: {
                 url: `https://placehold.co/200x200`,
                 localpath: "",

             },

            },

            username: {
                 type: String,
                 unique: true,
                 required: true,
                 trim: true,
                 lowercase: true,
                 index: true,
            },
            

            email: {
                 type: String,
                 unique: true,
                 required: true,
                 trim: true,
            },

            fullname: {
                 type: String,
                 trim: true,
            },

            password: {
                 type: String,
                 required: [true,"password is required"],
            },

            isEmailVerified: {
                 type: Boolean,
                 default: false,
            },

            refreshToken: {
                 type: String,
            },

            forgotPasswordToken: {
                 type: String,
            },

            forgotPasswordExpiry: {
                 type: Date,
            },

            emailVerificationToken: {
                 type: String,
            },

            emailVerificationExpiry: {
                 type: Date
            }
            
           

     

     
})

userSchema.pre("save",async function(){
        if(!(this.isModified("password"))) return;

       this.password =  await bcrypt.hash(this.password,10);
        
})

userSchema.methods.isPasswordCorrect = async function(password){
       return await bcrypt.compare(password,this.password)
}

//tokens with user information = refresh token,access token
//tokens without user information = temporary token(we make it by crypto)

userSchema.methods.generateAccessToken = function(){
        return jwt.sign({
             _id: this._id,
             email : this.email,
             username: this.username,
        },

         process.env.ACCESS_TOKEN_SECRET,

         {expiresIn : process.env.ACCESS_TOKEN_EXPIRY}

        )
}

userSchema.methods.generateRefreshToken = function(){
        return jwt.sign({
             _id: this._id,
             
        },

         process.env.REFRESH_TOKEN_SECRET,

         {expiresIn : process.env.REFRESH_TOKEN_EXPIRY}

        )
}

userSchema.methods.generateTemporaryToken = function(){
           const unHashedToken = crypto.randomBytes(20).toString("hex")
   //crypto returns hex value so we have to convert to string by using tostring("hex")

          const hashedToken = crypto.createHash("sha256")
                              .update(unHashedToken)
                              .digest("hex");

          const tokenExpiry = Date.now() + (20*60*1000) //20 mins
           return {unHashedToken,hashedToken,tokenExpiry};
}




export const User = mongoose.model("User",userSchema)

