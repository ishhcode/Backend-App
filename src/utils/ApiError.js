import { Error } from "mongoose";

class ApiError extends Error{
    constructor(
        statusCode,
        message= "something went wrong",
        errors= [],
        stack=""
    ){
        super(message),
        this.statusCode= statusCode
        this.data = null
        this.message = message
        this.success= false;
        this.errors= errors
        if(stack){
            this.stack = stack
        }
        else{
            // Capture the stack trace using the Error.captureStackTrace method
            Error.captureStackTrace(this,this.constructor)
        }



    }
}

export { ApiError }