import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
await mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
});
console.log("Connected to MongoDB Database");
