
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

        color: {
            type: String,
            default: "#F97316",
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
