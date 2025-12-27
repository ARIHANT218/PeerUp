import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
  console.log("Connecting to:", process.env.MONGO_URI);
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
};
