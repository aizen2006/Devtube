import asyncHandler from '../utils/asyncHandler.js'
import { ApiError } from "../utils/apiError.js"
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/fileUpload.js"
import { ApiResponse } from '../utils/ApiResponse.js'
import { validate } from 'uuid'


const generateAccessAndRefreshTokens = async(userId)=>{
    try {
        const user = User.findById(userId)
        if(!user){
            throw new ApiError (404 , "User not found")
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false}); // validation is not required here
        return { accessToken , refreshToken }
    } catch (error) {
        throw new ApiError(500, "Error generating tokens")
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
    const {accessToken , refreshToken}= await generateAccessAndRefreshTokens(user._id)
    
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
    User.findByIdAndUpdate(req.user._id,
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
export {registerUser , loginUser ,logoutUser}