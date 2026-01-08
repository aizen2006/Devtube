import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const healthcheck = asyncHandler(async ( _ , res) => {
    //TODO: build a healthcheck response that simply returns the OK status as json with a message
    try {
        return res.status(200).json(new ApiResponse(200, {message: "OK"} , "Healthcheck response"))
    } catch (error) {
        throw new ApiError(400, error?.message || "Failed to build healthcheck response")
    }
})

export {
    healthcheck
    }
    