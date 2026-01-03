import express from "express";
import dotenv from "dotenv";
import { connectDB, disconnectDB } from "./src/config/db.js";
import authRouter from "./src/routes/auth.routes.js";
import userRouter from "./src/routes/user.routes.js";
import postRouter from "./src/routes/posts.routes.js";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors());

async function start() {
  await connectDB(process.env.MONGO_URI);
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});

process.on("SIGINT", async () => {
  console.info("SIGINT signal received");
  await disconnectDB();
  process.exit(0);
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
