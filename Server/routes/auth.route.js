import express from "express";

import {
    registerUser,
    loginUser,
    sendEmailOTP,
    verifyEmailOTP,
    forgotPassword,
    resetPassword,
    getProfile,
    updateProfile,
    changePassword,
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// PUBLIC AUTHENTICATION ROUTES

// Register
router.post("/register", registerUser);

// Login with email and password
router.post("/login", loginUser);

// Send OTP
router.post("/send-otp", sendEmailOTP);

// Verify OTP
router.post("/verify-otp", verifyEmailOTP);

// Forgot password
router.post("/forgot-password", forgotPassword);

// Reset password
router.post("/reset-password", resetPassword);


// ===================================
// PROTECTED AUTHENTICATION ROUTES
// ===================================

// Get profile
router.get("/profile", protect, getProfile);

// Update profile
router.put("/profile", protect, updateProfile);

// Change password
router.put("/change-password", protect, changePassword);

export default router;
