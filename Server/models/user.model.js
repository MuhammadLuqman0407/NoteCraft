import mongoose from "mongoose";
import { type } from "os";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 60,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            select: false,
        },

        avatar: {
            type: String,
            default: null,
        },

        isEmailVerified: {
            type: Boolean,
            default: false,
        },

        recoveryKeyHash: {
            type: String,
            select: false,
            default: null,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        preferences: {
            theme: {
                type: String,
                enum: ["light", "dark", "system"],
                default: "light",
            },

            defaultView: {
                type: String,
                enum: ["notes", "tasks"],
                default: "notes",
            },
        },
    },
    {
        timestamps: true,
    }
);

const userModel = mongoose.model("users", userSchema);
export default userModel;