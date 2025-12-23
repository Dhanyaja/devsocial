import express from "express";
import protect from "../middleware/auth.middleware.js";
import { createPost } from "../controllers/post.controller.js";

const postRouter = express.Router();

postRouter.post("/", protect, createPost);

export default postRouter;
