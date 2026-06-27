import mongoose from "mongoose";
import logger from "../utils/logger.js";

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("connected to mongodb")
    } catch (error) {
        logger.error(error)
    }
}

export default connectDB;