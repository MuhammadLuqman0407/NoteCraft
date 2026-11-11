
import express from "express";

import {
    createNotebook,
    getAllNotebooks,
    getNotebookById,
    updateNotebook,
    deleteNotebook,
    getNotebookNotes,
    getNotebookStats,
} from "../controllers/notebook.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// All notebook routes require authentication
router.use(protect);

// NOTEBOOK CRUD ROUTES

// Create notebook
router.post("/", createNotebook);

// Get all notebooks
router.get("/", getAllNotebooks);

// Get notebook statistics
router.get("/:id/stats", getNotebookStats);

// Get all notes inside a notebook
router.get("/:id/notes", getNotebookNotes);

// Get single notebook
router.get("/:id", getNotebookById);

// Update notebook
router.put("/:id", updateNotebook);

// Delete notebook
router.delete("/:id", deleteNotebook);

export default router;
