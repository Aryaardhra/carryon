import express from "express";
import { changePassword, checkAuth, deleteAccountUser, forgotPassword, getAllUsers, getUserData, login, logout, refreshAccessToken, registerUser, resetPassword, updateProfile, verifyEmail } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.get("/verify-email/:token", verifyEmail);
userRouter.post("/login", login);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);
userRouter.post("/refresh-token", refreshAccessToken);
userRouter.patch("/change-password", authMiddleware, changePassword);
userRouter.get("/me", authMiddleware, getUserData);
userRouter.get("/check-auth", authMiddleware, checkAuth);
userRouter.get("/all-users", authMiddleware, adminMiddleware, getAllUsers);
userRouter.put("/update-profile", authMiddleware, upload.single("avatar"), updateProfile);
userRouter.delete("/delete-account", authMiddleware, deleteAccountUser);
userRouter.post("/logout", authMiddleware, logout);

export default userRouter;