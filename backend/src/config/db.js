// dhanyaja2003_db_user
// cTPRjpkTHBGlgFSY
// mongodb+srv://dhanyaja2003_db_user:<db_password>@cluster0.u8iyqbb.mongodb.net/?appName=Cluster0

import mongoose from "mongoose";

const DEFAULT_MONGO_OPTIONS = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
};

export async function connectDB(mongoUri) {
  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined");
  }
  try {
    await mongoose.connect(mongoUri, DEFAULT_MONGO_OPTIONS);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
