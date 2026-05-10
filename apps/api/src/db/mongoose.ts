import mongoose from "mongoose";
import { env } from "../config/env.js";

let connectionPromise: Promise<typeof mongoose> | null = null;

export async function connectDatabase() {
  if (mongoose.connection.readyState >= 1) return mongoose;

  connectionPromise ??= mongoose.connect(env.mongodbUri, {
    autoIndex: env.nodeEnv !== "production"
  });

  return connectionPromise;
}
