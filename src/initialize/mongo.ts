import mongoose from "mongoose";

export const connectToMongoDB = async () => {
  try {
    console.log((await mongoose.connect(process.env.MONGO_URI)).models)
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
