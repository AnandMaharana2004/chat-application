import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const output = await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected successfully");
        // console.log("db return data:", output.connection); // Output will be the Mongoose connection object
    } catch (error) {
        console.error("Database connection error:", error);
    }
};

export default connectDB;
