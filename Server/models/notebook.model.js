
import mongoose from "mongoose";

const notebookSchema = new mongoose.Schema(
    {
        // Notebook owner
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        // Notebook name
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 80,
        },

        // Notebook description
        description: {
            type: String,
            trim: true,
            maxlength: 300,
            default: "",
        },

        // Notebook color
        color: {
            type: String,
            default: "#F97316",
            match: /^#[0-9A-Fa-f]{6}$/,
        },

        // Notebook icon
        icon: {
            type: String,
            default: "folder",
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate notebook names for the same user
notebookSchema.index(
    { userId: 1, name: 1 },
    { unique: true }
);

const Notebook = mongoose.model(
    "Notebook",
    notebookSchema
);

export default Notebook;
