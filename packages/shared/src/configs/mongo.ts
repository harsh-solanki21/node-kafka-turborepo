import mongoose from "mongoose";

const connectDB = async (mongoURI: string) => {
  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("MongoDB Connection error: ", error);
    process.exit(1);
  }
};

export default connectDB;
