import express from "express";

import {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    completeTask,
    reopenTask,
    getTaskStats,
} from "../controllers/task.controller.js";

import {
    validate,
    validators,
    validateObjectId,
} from "../middleware/validate.middleware.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Protect all task routes
router.use(protect);

// Create task
router.post("/", createTask);

// Get all tasks with filtering
router.get("/", getAllTasks);

// Get task statistics
router.get("/stats", getTaskStats);

// Complete task
router.patch("/:id/complete", completeTask);

// Reopen task
router.patch("/:id/reopen", reopenTask);

// Get individual task
router.get("/:id", getTaskById);

// Update task
router.put("/:id", updateTask);

// Delete task
router.delete("/:id", deleteTask);

export default router;
