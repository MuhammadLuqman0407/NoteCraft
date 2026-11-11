import mongoose from "mongoose";
import config from "./config.js";

async function connectionDB() {
    try {
        const conn = await mongoose.connect(config.MONGO_URI);
        console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`Database connection error: ${error.message}`);
        throw error;
    }
}

export default connectionDB;