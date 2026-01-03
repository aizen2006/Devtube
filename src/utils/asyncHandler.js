

// this is the old way of handling errors
// const asyncHandler = (fn) => async(req,res,next) =>{
//     try {
//         await fn(req,res,next);
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message,
//         })
//     }
// }
// this is the new way of handling errors
const asyncHandler = (requestHandler) => {
    return (req,res,next) =>{
    Promise.resolve(requestHandler(req,res,next)).catch(error => next(error)); 
    }
}

export default asyncHandler 