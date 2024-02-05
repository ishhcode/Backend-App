import connectDB from "./db/index.js";
import {app} from './app.js';
//require("dotenv").config(); this apprach also works but code consistency is reduced
import dotenv from "dotenv";
dotenv.config({
    path: './.env'
});
const PORT_NO = process.env.PORT|| 8000


connectDB()
.then(()=>{
    //app.on is to check errors whether app is connected to db properly
    app.on("error",(error)=>{
        console.log("ERROR:",error);
        throw error;
    })
    app.listen(PORT_NO, () => {
        console.log(`Server is running on PORT: ${PORT_NO}`);
    })
})
.catch((error)=>{
    console.log("Mongo db connection failed",error)
});
