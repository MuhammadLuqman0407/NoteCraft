
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },

        description: {
            type: String,
            default: "",
        },

        // Task priority
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },

        // Task completion
        status: {
            type: String,
            enum: ["pending", "in-progress", "completed"],
            default: "pending",
        },

        // Task deadline
        dueDate: {
            type: Date,
            default: null,
        },

        // Associated tags
        tags: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Tag",
            },
        ],

        // Optional linked note
        noteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Note",
            default: null,
        },

        // Optional notebook
        notebookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Notebook",
            default: null,
        },

        completedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, dueDate: 1 });

const taskModel = mongoose.model("Task", taskSchema);

export default taskModel;
