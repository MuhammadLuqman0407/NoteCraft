
import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 40,
        },

        normalizedName: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },

        color: {
            type: String,
            default: "#F97316",
            match: /^#[0-9A-Fa-f]{6}$/,
        },

        description: {
            type: String,
            default: "",
            maxlength: 200,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate tag names for one user
tagSchema.index(
    { userId: 1, name: 1 },
    { unique: true }
);

const tagModel = mongoose.model("Tag", tagSchema);

export default tagModel;
