
import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
    {
        // Note owner
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        // Note title
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
            default: "Untitled Note",
        },

        // Note content
        content: {
            type: String,
            default: "",
        },

        // Associated tags
        tags: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Tag",
            },
        ],

        // Associated notebook
        notebookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Notebook",
            default: null,
        },

        // Favorite functionality
        isFavorite: {
            type: Boolean,
            default: false,
        },

        // Pin functionality
        isPinned: {
            type: Boolean,
            default: false,
        },

        // Note state
        status: {
            type: String,
            enum: ["active", "archived", "trash"],  // status - {Restore, Archieve, Move to Trash }
            default: "active",
        },

        trashedAt: {
            type: Date,
            default: null,
        },

        // Protected note functionality
        isLocked: {
            type: Boolean,
            default: false,
        },

        // Encrypted content for protected notes
        encryptedContent: {
            type: String,
            default: null,
            select: false,
        },

        encryptionMetadata: {
            algorithm: {
                type: String,
                default: null,
            },

            iv: {
                type: String,
                default: null,
            },

            salt: {
                type: String,
                default: null,
            },
        },

        // Optional color for notes
        color: {
            type: String,
            default: "#FFFFFF",
        },
    },
    {
        timestamps: true,
    }
);

// Useful indexes
noteSchema.index({ userId: 1, status: 1 });
noteSchema.index({ userId: 1, isFavorite: 1 });
noteSchema.index({ userId: 1, isPinned: 1 });
noteSchema.index({ userId: 1, updatedAt: -1 });

const noteModel = mongoose.model("Note", noteSchema);

export default noteModel;
