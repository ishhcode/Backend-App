const asyncHandler = (requestHandler) =>
    {return(req, res, next) => {
        // Promise.resolve() is used to convert non-Promise values to Promises
        // This allows the requestHandler to be both synchronous and asynchronous

        // Execute the requestHandler function and handle any errors
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }};

export { asyncHandler }



//const asyncHandler= (func)=>{()=>{}}//higher order function
//(err,req,res,next)
/* wrapper function
const asyncHandler = (fn)=> async(req,res,next)=>{
    try {
        await fn(req,res,next)
        
    } catch (error) {
        res.status(err.code || 500).json({
            success: false,
            message: err.message
        })
    }
   

}
*/