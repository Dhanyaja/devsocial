import express from "express";
import protect from "../middleware/auth.middleware.js";
import { getMyProfile, getUserById } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/me", protect, getMyProfile);
userRouter.get("/:id", protect, getUserById);

export default userRouter;
