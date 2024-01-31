import { Error } from "mongoose";

class ApiError extends Error{
    constructor(
        statusCode,
        message= "something went wrong",
        errors= [],
        statck=""
    ){
        super(message),
        this.statusCode= statusCode
        this.data = null
        this.message = message
        this.success= false;
        this.errors= errors
        if(statck){
            this.stack = statck 
        }
        else{
            // Capture the stack trace using the Error.captureStackTrace method
            Error.captureStackTrace(this,this.constructor)
        }



    }
}

export { ApiError }