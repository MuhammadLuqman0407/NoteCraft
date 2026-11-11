import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import noteRoutes from "./routes/note.route.js";
import notebookRoutes from "./routes/notebook.route.js";
import tagRoutes from "./routes/tag.route.js";
import taskRoutes from "./routes/task.route.js";

import { AppError } from "../middleware/error.middleware.js";

import dotenv from "dotenv";

const app = express();
dotenv.config();

app.use(morgan("dev"));
app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Base Route & Health Check
app.get("/", (req, res) => {
    res.json({ message: "NoteCraft API is running successfully!" });
});

app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// 404 Route handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Internal Server Error:", err.stack);
    res.status(err.status || 500).json({
        message: err.message || "An unexpected error occurred",
    });
});

app.use("/api/notes", noteRoutes);

export default app;