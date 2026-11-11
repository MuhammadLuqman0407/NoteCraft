import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true,
        },

        otpHash: {
            type: String,
            required: true,
            select: false,
        },

        purpose: {
            type: String,
            enum: [
                "email-verification",
                "login",
                "password-reset",
            ],
            required: true,
        },

        attempts: {
            type: Number,
            default: 0,
        },

        expiresAt: {
            type: Date,
            required: true,
        },

        verifiedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Automatically delete expired OTP documents
otpSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);

const otpModel = mongoose.model("otp", otpSchema)

export default otpModel