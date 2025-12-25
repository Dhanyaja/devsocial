import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
  addComment,
  createPost,
  deleteComment,
  deletePost,
  getFeed,
  getPostsByUser,
  toggleLike,
} from "../controllers/post.controller.js";

const postRouter = express.Router();

postRouter.post("/", protect, createPost);
postRouter.get("/feed", protect, getFeed);
postRouter.get("/user/:id", protect, getPostsByUser);
postRouter.post("/:id/like", protect, toggleLike);
postRouter.post("/:id/comment", protect, addComment);
postRouter.delete("/:id", protect, deletePost);
postRouter.delete("/:postId/comment/:commentId", protect, deleteComment);

export default postRouter;
