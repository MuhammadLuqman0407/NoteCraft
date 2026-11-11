import crypto from "crypto";

import bcrypt from "bcryptjs";

import userModel from "../models/userModel.js";
import otpModel from "../models/otpModel.js";

import generateToken from "./utils/generateToken.js";
import { sendOTPEmail } from "../services/email.service.js";

import jwt from "jsonwebtoken";
import config from "../config/config.js";

import { sendEmail } from "../services/email.services.js";
import { generateOtp, getOtpHtml } from "../utils/utils.js";


const generateOTP = () => {
    return crypto.randomInt(100000, 1000000).toString();
};

const createAndSendOTP = async (email, purpose) => {
    // Generate six-digit OTP
    const otp = generateOTP();

    // Hash OTP before saving
    const otpHash = await bcrypt.hash(otp, 10);

    // Remove previous challenge for same purpose
    await OtpChallenge.deleteMany({
        email,
        purpose,
    });

    // Save new OTP challenge
    await OtpChallenge.create({
        email,
        otpHash,
        purpose,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // Send OTP through email
    try {
        await sendOTPEmail(email, otp, purpose);
    } catch (error) {
        // Remove challenge if email delivery fails
        await OtpChallenge.deleteMany({
            email,
            purpose,
        });

        throw error;
    }
};

const createAuthResponse = (user) => {
    return {
        token: generateToken(user._id),
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            isEmailVerified: user.isEmailVerified,
            preferences: user.preferences,
        },
    };
};



export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide name, email and password",
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Check existing account
        const existingUser = await userModel.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered",
            });
        }

        // Hash password
        const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

        // Create user
        const user = await userModel.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
        });

        // Send email verification OTP
        try {
            await createAndSendOTP(
                normalizedEmail,
                "email-verification"
            );
            await sendEmail(email, "OTP Verification", `Your OTP Code is ${otp}`, html);
        }
        catch (emailError) {
            // Keep the account so the user can request another OTP
            console.error("OTP email failed:", emailError.message);

            return res.status(503).json({
                success: false,
                message: "Account created, but OTP delivery failed. Please request another OTP.",
            });
        }

        res.status(201).json({
            success: true,
            message: "Account created. Please verify your email.",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                isEmailVerified: user.isEmailVerified,
            },
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase(),
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        if (!user.isEmailVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email before logging in",
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account is disabled",
            });
        }

        const authData = createAuthResponse(user);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: authData,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const sendEmailOTP = async (req, res) => {
    try {
        const { email, purpose } = req.body;

        if (!email || !purpose) {
            return res.status(400).json({
                success: false,
                message: "Email and purpose are required",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const allowedPurposes = [
            "email-verification",
            "login",
            "password-reset",
        ];

        if (!allowedPurposes.includes(purpose)) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP purpose",
            });
        }

        const user = await User.findOne({
            email: normalizedEmail,
        });

        // Generic response for password reset
        if (purpose === "password-reset" && !user) {
            return res.status(200).json({
                success: true,
                message: "If the account exists, an OTP will be sent.",
            });
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Account not found",
            });
        }

        if (purpose === "email-verification" && user.isEmailVerified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified",
            });
        }

        if (purpose === "login" && !user.isEmailVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email first",
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Account is disabled",
            });
        }

        await createAndSendOTP(normalizedEmail, purpose);

        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const verifyEmailOTP = async (req, res) => {
    try {
        const { email, otp, purpose } = req.body;

        if (!email || !otp || !purpose) {
            return res.status(400).json({
                success: false,
                message: "Email, OTP and purpose are required",
            });
        }

        if (!/^\d{6}$/.test(otp)) {
            return res.status(400).json({
                success: false,
                message: "OTP must contain six digits",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const challenge = await OtpChallenge.findOne({
            email: normalizedEmail,
            purpose,
        }).select("+otpHash");

        if (!challenge) {
            return res.status(400).json({
                success: false,
                message: "OTP not found or expired",
            });
        }

        if (challenge.expiresAt <= new Date()) {
            await challenge.deleteOne();

            return res.status(400).json({
                success: false,
                message: "OTP has expired",
            });
        }

        if (challenge.attempts >= 5) {
            await challenge.deleteOne();

            return res.status(429).json({
                success: false,
                message: "Too many incorrect attempts",
            });
        }

        // Compare OTP hash
        const isValid = await bcrypt.compare(
            otp,
            challenge.otpHash
        );

        if (!isValid) {
            challenge.attempts += 1;
            await challenge.save();

            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
                attemptsRemaining: Math.max(
                    0,
                    5 - challenge.attempts
                ),
            });
        }

        const user = await User.findOne({
            email: normalizedEmail,
        });

        if (!user || !user.isActive) {
            return res.status(404).json({
                success: false,
                message: "Account not found or disabled",
            });
        }

        // Email verification
        if (purpose === "email-verification") {
            if (user.isEmailVerified) {
                await challenge.deleteOne();

                return res.status(400).json({
                    success: false,
                    message: "Email is already verified",
                });
            }

            user.isEmailVerified = true;
            await user.save();

            await challenge.deleteOne();

            return res.status(200).json({
                success: true,
                message: "Email verified successfully",
            });
        }

        // Password reset: mark OTP as verified
        if (purpose === "password-reset") {
            challenge.verifiedAt = new Date();
            await challenge.save();

            return res.status(200).json({
                success: true,
                message: "OTP verified. You can now reset your password.",
            });
        }

        // OTP login
        if (purpose === "login") {
            if (!user.isEmailVerified) {
                return res.status(403).json({
                    success: false,
                    message: "Please verify your email first",
                });
            }

            await challenge.deleteOne();

            const authData = createAuthResponse(user);

            return res.status(200).json({
                success: true,
                message: "Login successful",
                data: authData,
            });
        }

        return res.status(400).json({
            success: false,
            message: "Unsupported OTP purpose",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            email: normalizedEmail,
        });

        // Do not reveal whether an account exists
        if (!user || !user.isActive) {
            return res.status(200).json({
                success: true,
                message: "If the account exists, an OTP will be sent.",
            });
        }

        await createAndSendOTP(
            normalizedEmail,
            "password-reset"
        );

        res.status(200).json({
            success: true,
            message: "If the account exists, an OTP will be sent.",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Email and new password are required",
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Only an OTP-verified challenge can authorize reset
        const challenge = await OtpChallenge.findOne({
            email: normalizedEmail,
            purpose: "password-reset",
            verifiedAt: { $ne: null },
            expiresAt: { $gt: new Date() },
        });

        if (!challenge) {
            return res.status(403).json({
                success: false,
                message: "Please verify your password reset OTP first",
            });
        }

        const user = await User.findOne({
            email: normalizedEmail,
            isActive: true,
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Account not found",
            });
        }

        // Hash new password
        user.password = await bcrypt.hash(newPassword, 12);

        await user.save();

        // Remove used challenge
        await challenge.deleteOne();

        res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Both passwords are required",
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "New password must contain at least 8 characters",
            });
        }

        if (currentPassword === newPassword) {
            return res.status(400).json({
                success: false,
                message: "New password must be different",
            });
        }

        const user = await User.findById(
            req.user._id
        ).select("+password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const isPasswordValid = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect",
            });
        }

        user.password = await bcrypt.hash(newPassword, 12);

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                isEmailVerified: user.isEmailVerified,
                preferences: user.preferences,
                createdAt: user.createdAt,
            },
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



export const updateProfile = async (req, res) => {
    try {
        const { name, avatar, preferences } = req.body;

        const updates = {};

        if (name !== undefined) {
            if (typeof name !== "string" || name.trim().length < 2) {
                return res.status(400).json({
                    success: false,
                    message: "Name must contain at least 2 characters",
                });
            }

            updates.name = name.trim();
        }

        if (avatar !== undefined) {
            updates.avatar = avatar;
        }

        if (preferences !== undefined) {
            const allowedThemes = ["light", "dark", "system"];
            const allowedViews = ["notes", "tasks"];

            if (
                preferences.theme !== undefined &&
                !allowedThemes.includes(preferences.theme)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid theme",
                });
            }

            if (
                preferences.defaultView !== undefined &&
                !allowedViews.includes(preferences.defaultView)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid default view",
                });
            }

            if (preferences.theme !== undefined) {
                updates["preferences.theme"] = preferences.theme;
            }

            if (preferences.defaultView !== undefined) {
                updates["preferences.defaultView"] = preferences.defaultView;
            }
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updates },
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                preferences: user.preferences,
            },
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const updateProfile = async (req, res) => {
    try {
        const { name, avatar, preferences } = req.body;

        const updates = {};

        if (name !== undefined) {
            if (typeof name !== "string" || name.trim().length < 2) {
                return res.status(400).json({
                    success: false,
                    message: "Name must contain at least 2 characters",
                });
            }

            updates.name = name.trim();
        }

        if (avatar !== undefined) {
            updates.avatar = avatar;
        }

        if (preferences !== undefined) {
            const allowedThemes = ["light", "dark", "system"];
            const allowedViews = ["notes", "tasks"];

            if (
                preferences.theme !== undefined &&
                !allowedThemes.includes(preferences.theme)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid theme",
                });
            }

            if (
                preferences.defaultView !== undefined &&
                !allowedViews.includes(preferences.defaultView)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid default view",
                });
            }

            if (preferences.theme !== undefined) {
                updates["preferences.theme"] = preferences.theme;
            }

            if (preferences.defaultView !== undefined) {
                updates["preferences.defaultView"] = preferences.defaultView;
            }
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updates },
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                preferences: user.preferences,
            },
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
