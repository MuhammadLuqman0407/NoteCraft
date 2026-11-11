
import mongoose from "mongoose";

const notebookSchema = new mongoose.Schema(
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
            maxlength: 80,
        },

        description: {
            type: String,
            default: "",
        },

        color: {
            type: String,
            default: "#F97316",
        },

        icon: {
            type: String,
            default: "folder",
        },
    },
    {
        timestamps: true,
    }
);

notebookSchema.index(
    { userId: 1, name: 1 },
    { unique: true }
);

const notebookModel = mongoose.model(
    "Notebook",
    notebookSchema
);

export default notebookModel;
