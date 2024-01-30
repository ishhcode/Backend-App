import connectDB from "./db/index.js";
//require("dotenv").config(); this apprach also works but code consistency is reduced
import dotenv from "dotenv";
dotenv.config({
    path: './env'
});


connectDB();