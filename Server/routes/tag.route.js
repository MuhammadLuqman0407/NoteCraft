
import express from "express";

import {
    createTag,
    getAllTags,
    getTagById,
    updateTag,
    deleteTag,
    getTagNotes,
    getTagStats,
} from "../controllers/tag.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// All tag routes require authentication
router.use(protect);

// TAG CRUD ROUTES

// Create tag
router.post("/", createTag);

// Get all tags
router.get("/", getAllTags);

// Get tag statistics
router.get("/:id/stats", getTagStats);

// Get all notes associated with a tag
router.get("/:id/notes", getTagNotes);

// Get single tag
router.get("/:id", getTagById);

// Update tag
router.put("/:id", updateTag);

// Delete tag
router.delete("/:id", deleteTag);

export default router;
