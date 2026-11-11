
import express from "express";

import {
    createNote,
    getAllNotes,
    getNoteById,
    updateNote,
    deleteNote,
} from "../controllers/note.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Create note
router.post("/", createNote);

// Get all notes
router.get("/", getAllNotes);

// Get one note
router.get("/:id", getNoteById);

// Update note
router.put("/:id", updateNote);

// Move note to trash
router.delete("/:id", deleteNote);

export default router;
