import asyncHandler from '../utils/asyncHandler.js'
import { ApiError } from "../utils/apiError.js"
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/fileUpload.js"
import { ApiResponse } from '../utils/ApiResponse.js'
import jwt from 'jsonwebtoken'

const generateAccessAndRefreshTokens = async(userId)=>{
    try {
        const user = await User.findById(userId)
        if(!user){
            throw new ApiError (404 , "User not found")
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false}); // validation is not required here
        return { accessToken , refreshToken }
    } catch (error) {
        throw new ApiError(500, "Error generating tokens" , error)
    }
}

const registerUser = asyncHandler(async(req, res) =>{   
    // get user detail from the user from the frontend
    // validation - not empty and valid 
    // check if user already exists :username or email
    // check foe images and check for avatar
    // upload them to cloudinary , check upload
    //create user objects - create entry in db 
    // remove password and refresh token filed from the response 
    //check for user creation
    // return res

    const { fullname , email , username , password } = req.body
    /* console.log(fullname , email , username ); */
    if (
        [fullname,email,password,username].some((field)=> field?.trim() ==="")
    ){
        throw new ApiError(400,"All fields are is required")
    }

    const existedUser = await User.findOne({
        $or:[{ username }, { email }]
    })
    if(existedUser){
        throw new ApiError(409, "User with email or Username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if(req.files && req.files.length > 0 && Array.isArray(req.files.coverImage)){
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar file is Requied")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage.url || "",
        email,
        password,
        username: username.toLowerCase(),

    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser) {
        throw new ApiError(500 , "Something went wrong while regestering the user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
    )



})

const loginUser = asyncHandler (async (req , res) => {
    //req.body -> data from frontend
    // validation - not empty and valid 
    // check if user exists 
    // match password
    // generate access and refresh jwt token
    // send cookies
    // return res

    const {username , email ,password} = req.body
    if (!(username || email)){
        throw new ApiError (400, "Username or Email is required to login")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if(!user){
        throw new ApiError(404 , "User not found")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(401 , "Invalid credentials")
    }
    const {accessToken , refreshToken}= await generateAccessAndRefreshTokens(user._id.toString())
    
    const LoggedInUser = await User.findById(user._id).select("-password -refreshToken")
    const cookieOptions = {
        httpOnly: true, // accessible only by web server
        secure:true
    }
    return res
    .status(200)
    .cookie("accessToken", accessToken , cookieOptions)
    .cookie("refreshToken", refreshToken , cookieOptions)
    .json(
        new ApiResponse (
            200,
            { 
                user: LoggedInUser,
                accessToken,
                refreshToken,
            },
            "User logged in successfully"
        )
    )
})

const logoutUser =asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(req.user._id,
        { 
            $set:{ refreshToken : undefined 

            }
        },
        { new: true }
    );
    const cookieOptions = {
        httpOnly: true, // accessible only by web server
        secure:true
    }
    return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json( new ApiResponse(200, {}, "User logged out successfully"))
})

const refreshAccessToken = asyncHandler(async(req,res)=>{
    const incommingRefreshToken = req.cookies.refreshToken  || req.body.refreshToken
    if(!incommingRefreshToken){
        throw new ApiError (401, "Unauthenticated access - no refresh token")
    }
    try {
        const decodedToken = jwt.verify( incommingRefreshToken, process.env.REFRESH_TOKEN_SECRET )
    
        const user = await User.findById ( decodedToken?._id )
        if(!user){
            throw new ApiError (401, "Invalid refresh token")
        }
        if (incommingRefreshToken !== user?.refreshToken) {
            throw new ApiError (401, "refresh token is expired or used")
        }
        const { accessToken , newRefreshToken } = await generateAccessAndRefreshTokens ( user._id.toString() )
    
        const cookieOptions = {
            httpOnly: true, // accessible only by web server
            secure:true
        }
    
        return  res.status(200)
        .cookie("accessToken", accessToken , cookieOptions)
        .cookie("refreshToken", newRefreshToken , cookieOptions)
        .json(
            new ApiResponse (
                200,
                { accessToken , newRefreshToken },
                "Access token refreshed successfully"
            )
        )
    } catch (error) {
        throw new ApiError (401, error?.message || "Invalid Refresh token")
    }

})

const changeCurrentPassword = asyncHandler(async(req,res) => {
    const { oldPassword , newPassword } = req.body;
    const user = await User.findById(req.user?._id)
    const passwordValdation = await user.isPasswordCorrect(oldPassword);
    if(!passwordValdation){
        throw new ApiError (400 , "old password is incorrect")
    }
    user.password= newPassword;
    await user.save({validateBeforeSave: false});
    return res.status(200)
    .json(
        new ApiResponse(200, {} , "Password changed successfully")
    )

})
const getCurrentUser=asyncHandler(async(req,res)=>{
    return res.status(200).json(
        new ApiResponse(200, req.user , "Current user fetched successfully")
    );
})
const updateAccountDetails = asyncHandler (async(req,res) => {
    /*
    we will use multer to reUpload the coverImage and avatar if user wants to update them
    user verifyJWT middleware to get the user from the token
    then we will update the fields that are sent from the frontend 
    then we have to replace the old images if new images are sent
    and upload them to cloudinary
    finally we will save the user and return the updated user details

    write controllers for file uploads separately 
    */
    const user = res.user;
    const { fullname , email } = req.body;
    
    if (!(fullname && email)) {
        throw new ApiError (400 , "fullname and email are required")
    } 
    const newUser = User.findByIdAndUpdate(
        user?._id,
        { $set: { fullname , email } },
        { new: true}
    ).select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse (200, newUser , "User details updated successfully")
    )
})

const updateUserAvatar = asyncHandler (async (req,res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError (400 , "Avatar file is required")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if (!avatar.url) {
        throw new ApiError (500 , "Error uploading avatar image")
    }
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { avatar: avatar.url } },
        { new: true }
    ).select("-password -refreshToken")

    return res.status(200 ).json(
        new ApiResponse(200 ,updatedUser,"User's avatar updated successfully")
    )
})

const updateCoverImage = asyncHandler(async(req,res) =>{
    const coverImageLocalPath = req.file?.path
    if(!coverImageLocalPath){
        throw new ApiError(400 ,'CoverImage file is required')
    }
    const coverImage =await uploadOnCloudinary(coverImageLocalPath)
    if(!coverImage){
        throw new ApiError(500 , "Error while Uploading coverImage")
    }
    const updatedUser = await User.findOneAndUpdate(
        req.user._id,
        {$set:{coverImage: coverImage.url}},
        {new:true}
    ).select("-password -refreshToken")

    return res.status(200 ).json(
        new ApiResponse(200 ,updatedUser,"User's coverImage updated successfully")
    )
})

export {
    registerUser , 
    loginUser ,
    logoutUser ,
    refreshAccessToken , 
    changeCurrentPassword ,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateCoverImage
}