import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
  acceptFriendRequest,
  getMyProfile,
  getUserById,
  rejectFriendRequest,
  removeFriend,
  sendFriendRequest,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/me", protect, getMyProfile);
userRouter.get("/:id", protect, getUserById);
userRouter.post("/:id/request", protect, sendFriendRequest);
userRouter.post("/:id/accept", protect, acceptFriendRequest);
userRouter.post("/:id/reject", protect, rejectFriendRequest);
userRouter.post("/:id/remove", protect, removeFriend);

export default userRouter;
