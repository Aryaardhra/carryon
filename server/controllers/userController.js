import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../configs/cloudinary.js";
import { sendEmail } from "../configs/mail.js";
import redis from "../configs/redis.js";
import userModel from "../models/userModel.js";
import { forgotPasswordTemplate } from "../templates/forgotPasswordTemplate.js";
import { verifyEmailTemplate } from "../templates/verifyEmailTemplate.js";
//import { verifyEmailTemplate } from "../templates/verifyEmailTemplate.js";
import { welcomeEmailTemplate } from "../templates/welcomeEmail.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens.js";
import logger from "../utils/logger.js";
import {
  validateChangePassword,
  validateLogin,
  validateRegistration,
  validateResetPassword,
} from "../utils/validation.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export const registerUser = async (req, res, next) => {
  try {
    const { error } = validateRegistration(req.body);

    if (error) {
      logger.warn(`Validation Error: ${error.details[0].message}`);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { name, email, password } = req.body;

    const exitingUser = await userModel.findOne({ email });

    if (exitingUser) {
      logger.warn("User already exist");
      return res.status(400).json({
        success: false,
        message: "An account already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const rawToken = crypto.randomBytes(32).toString("hex");

    const hashToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      verificationToken: hashToken,
      verificationTokenExpiry: new Date(Date.now() + 60 * 60 * 1000),
    });

    try {
      const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${rawToken}`;

      await sendEmail(
        user.email,
        "Verify your email",
        verifyEmailTemplate(user.name, verificationUrl),
      );
    } catch (error) {
      await user.deleteOne();
      logger.error(`Verification Email Error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: "Unable to send verification email. Please try again.",
      });
    }

    logger.info(`Registration successful: ${user.email}`);

    res.status(201).json({
      success: true,
      message: "user created successfully! please verify your email.",
    });
  } catch (error) {
    logger.error(`Register Error: ${error.message}`);
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await userModel.findOne({
      verificationToken: hashedToken,
      verificationTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      logger.warn("Invalid or expired verification token");
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification link",
      });
    }

    user.isEmailVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;

    await user.save();

    try {
      await sendEmail(
        user.email,
        "Welcome to CARRYON",
        welcomeEmailTemplate(user.name),
      );
    } catch (error) {
      logger.error(error.message);
    }

    logger.info(`Email verified for user: ${user.email}`);

    res.status(200).json({
      success: true,
      message: "Email verified! Please login.",
    });
  } catch (error) {
    logger.error(`Verify Email Error : ${error.message}`);
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { error } = validateLogin(req.body);

    if (error) {
      logger.warn(`Validation Error: ${error.details[0].message}`);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      logger.warn(`Login failed: ${email}`);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials!",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      logger.warn(`Incorrect Password: ${email}`);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials!",
      });
    }

    if (!user.isEmailVerified) {
      logger.warn(`Email verification failed : ${email}`);
      return res.status(403).json({
        success: false,
        message: "Email verification failed! Please verify your email.",
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user._id);

    const isProduction = process.env.NODE_ENV === "production";

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    };

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    logger.info(`Login successful: ${user.email}`);

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    logger.error(`Login Error : ${error.message}`);
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email?.trim()) {
      logger.warn("Forgot password attempted without email");
      return res.status(400).json({
        success: false,
        message: "Email Required!",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      logger.warn(`Forgot password requested for non-existent email: ${email}`);
      return res.status(200).json({
        success: true,
        message: "If an account exist then a reset email has been sent.",
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    await redis.set(
      `password-reset:${hashedToken}`,
      user._id.toString(),
      "EX",
      900,
    );

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;

    await sendEmail(
      user.email,
      "Reset your password",
      forgotPasswordTemplate(user.name, resetUrl),
    );

    logger.info(`Password reset email sent: ${user.email}`);

    return res.status(200).json({
      success: true,
      message:
        "Password reset email sent successfully. Please check your inbox.",
    });
  } catch (error) {
    logger.error(`Error while resetting the password : ${error.message}`);
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { error } = validateResetPassword(req.body);

    if (error) {
      logger.warn(`Validation Error: ${error.details[0].message}`);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const userId = await redis.get(`password-reset:${hashedToken}`);
    console.log("redis userId:", userId);
    if (!userId) {
      logger.warn(`Invalid or expire password token`);
      return res.status(400).json({
        success: false,
        message: "Invaild or expired link",
      });
    }

    const user = await userModel.findById(userId).select("+password");

    if (!user) {
      logger.warn(`User not found for password reset`);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const samePassword = await bcrypt.compare(password, user.password);

    if (samePassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as the old password",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.passwordChangedAt = new Date();
    await user.save();

    //delete token after successful reset password

    await redis.del(`password-reset:${hashedToken}`);

    const refreshToken = await redis.get(`user-refresh:${user._id}`);

    if (refreshToken) {
      await redis.del(`refresh:${refreshToken}`);

      await redis.del(`user-refresh:${user._id}`);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    logger.info(`Password reset successful : ${user.email}`);

    return res.status(200).json({
      success: true,
      message: "Password reset successful. Please login again",
    });
  } catch (error) {
    logger.error(`Reset Password Error : ${error.message}`);
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { error } = validateChangePassword(req.body);

    if (error) {
      logger.warn(`Validation Error: ${error.details[0].message}`);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password do not match!",
      });
    }

    const user = await userModel.findById(req.user._id).select("+password");

    if (!user) {
      logger.warn(`user not found : ${req.user._id}`);
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      logger.warn(`Wrong current password : ${user.email}`);
      return res.status(401).json({
        success: false,
        message: "current password is incorrect!",
      });
    }

    const samePassword = await bcrypt.compare(newPassword, user.password);

    if (samePassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as the current password",
      });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.passwordChangedAt = new Date();
    await user.save();

    const refreshToken = await redis.get(`user-refresh:${user._id}`);

    if (refreshToken) {
      await redis.del(`refresh:${refreshToken}`);
      await redis.del(`user-refresh:${user._id}`);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    logger.info(`Password changed successfully : ${user.email}`);

    return res.status(200).json({
      success: true,
      message: "Password changed successfully! please login again.",
    });
  } catch (error) {
    logger.error(`Reset Password Error : ${error.message}`);
    next(error);
  }
};

export const refreshAccessToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      logger.warn("Refresh token missing!");

      return res.status(401).json({
        success: false,
        message: "Refresh token missing",
      });
    }

    const userId = await redis.get(
      `refresh:${refreshToken}`,
    );

    if (!userId) {
      logger.warn("Invalid or expired refresh token");

      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      logger.warn(`User not found: ${userId}`);

      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Only generate a new access token.
    // The refresh token remains unchanged.
    const accessToken = generateAccessToken(user);

    const isProduction =
      process.env.NODE_ENV === "production";

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    };

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    logger.info(
      `Access token refreshed: ${user.email}`,
    );

    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    logger.error(
      `Refresh Token Error: ${error.message}`,
    );

    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userModel
      .find()
      .select("-password -verification -verificationTokenExpiry");

    logger.info(`Fetched ${users.length} users`);

    return res.status(200).json({
      success: true,
      message: "fetched all users!",
      users,
    });
  } catch (error) {
    logger.error(`GetAllUsers Error: ${error.message}`);
    next(error);
  }
};

export const getUserData = async (req, res, next) => {
  try {
    const user = await userModel
      .findById(req.user._id)
      .select("-password -verification -verificationTokenExpiry");

    if (!user) {
      logger.warn(`User not found: ${req.user._id}`);
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification link",
      });
    }

    logger.info(`Fetched user profile: ${user.email}`);

    return res.status(200).json({
      success: true,
      message: "fetched all users!",
      user,
    });
  } catch (error) {
    logger.error(`Get all users Error: ${error.message}`);
    next(error);
  }
};

export const checkAuth = (req, res, next) => {
  try {
    const userId = req.user.id;

    if (!req.user || !req.user.id) {
      logger.warn("Unauthorized access attempt");
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    logger.info(`Authorized user: ${req.user.id}`);

    return res.status(200).json({
      success: true,
      message: "Authorized",
      user: {
        id: req.user.id,
        role: req.user.role,
      },
    });
  } catch (error) {
    logger.error(`Get all users Error: ${error.message}`);
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      logger.warn(`User not found: ${req.user.id}`);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { name } = req.body;

    //update name

    if (name?.trim()) {
      user.name = name.trim();
    }

    //update avatar

    if (req.file) {
      //delete previous avatar

      if (user.avatar.public_id) {
        await deleteFromCloudinary(user.avatar.public_id);
      }

      //upload new avatar

      const result = await uploadToCloudinary(req.file);
      user.avatar = {
        publicId: result.public_id,
        url: result.secure_url,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        format: result.format,
        size: result.bytes,
      };
    }

    await user.save();

    logger.info(`Profile updated successfully: ${user.email}`);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        format: user.format,
        size: user.bytes,
      },
    });
  } catch (error) {
    logger.error(`Update Profile Error: ${error.message}`);
    next(error);
  }
};

export const deleteAccountUser = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password?.trim()) {
      logger.warn("Delete account attempted without password");
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    const user = await userModel.findById(req.user.id).select("+password");

    if (!user) {
      logger.warn(`User not found: ${req.user.id}`);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //verify current password

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      logger.warn(`Delete account failed. Wrong password: ${user.email}`);
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    //delete avatar from cloudinary

    if (user.avatar?.publicId) {
      await deleteFromCloudinary(user.avatar.publicId);
    }

    //delete refresh token from redis

    const refreshToken = await redis.get(`user-refresh:${user._id}`);

    if (refreshToken) {
      await redis.del(`refresh:${refreshToken}`);
      await redis.del(`user-refresh:${user._id}`);
    }

    //delete user from mongodb

    await user.deleteOne();

    const isProduction = process.env.NODE_ENV === "production";

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    };

    res.clearCookie("accessToken", {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    res.clearCookie("refreshToken", {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    logger.info(`Account deleted successfully: ${user.email}`);

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    logger.error(`Delete Account Error: ${error.message}`);
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      const userId = await redis.get(`refresh:${refreshToken}`);

      await redis.del(`refresh:${refreshToken}`);

      if (userId) {
        await redis.del(`user-refresh:${userId}`);
      }
    }
    const isProduction = process.env.NODE_ENV === "production";

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    };
    res.clearCookie("accessToken", {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    res.clearCookie("refreshToken", {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    logger.info(`Logout successful: ${req.user.email}`);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    logger.error(`Logout Error: ${error.message}`);
    next(error);
  }
};
