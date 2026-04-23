import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();
mongoose.set("strict", false);

//@ts-ignore
let cached = global.mongoose;
if (!cached) {
  //@ts-ignore
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(process.env.MONGODBURI as string, opts)
      .then((mongoose) => {
        console.log("success");
        return mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

export default connectDB;
