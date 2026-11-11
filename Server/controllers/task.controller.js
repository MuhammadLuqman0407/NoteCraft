import mongoose from "mongoose";

import Task from "../models/Task.js";
import Notebook from "../models/Notebook.js";
import Tag from "../models/Tag.js";



const allowedStatuses = [
    "pending",
    "in-progress",
    "completed",
];

const allowedPriorities = [
    "low",
    "medium",
    "high",
    "urgent",
];

const validateReferences = async (
    userId,
    notebookId,
    tagIds
) => {
    // Validate notebook ownership
    if (notebookId !== undefined && notebookId !== null) {
        if (!mongoose.isValidObjectId(notebookId)) {
            return "Invalid notebook ID";
        }

        const notebook = await Notebook.findOne({
            _id: notebookId,
            userId,
        });

        if (!notebook) {
            return "Notebook not found";
        }
    }

    // Validate tags
    if (tagIds !== undefined) {
        if (!Array.isArray(tagIds)) {
            return "Tags must be an array";
        }

        if (
            tagIds.some(
                (id) => !mongoose.isValidObjectId(id)
            )
        ) {
            return "One or more tag IDs are invalid";
        }

        const uniqueIds = [
            ...new Set(tagIds.map(String)),
        ];

        const validTags = await Tag.find({
            _id: { $in: uniqueIds },
            userId,
        }).select("_id");

        if (validTags.length !== uniqueIds.length) {
            return "One or more tags do not belong to you";
        }

        return {
            notebookId,
            tagIds: validTags.map((tag) => tag._id),
        };
    }

    return { notebookId, tagIds };
};


export const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            status,
            priority,
            dueDate,
            notebookId,
            tags,
            reminderAt,
        } = req.body;

        // Validate title
        if (
            typeof title !== "string" ||
            !title.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Task title is required",
            });
        }

        if (title.trim().length > 150) {
            return res.status(400).json({
                success: false,
                message: "Title cannot exceed 150 characters",
            });
        }

        // Validate status
        if (
            status !== undefined &&
            !allowedStatuses.includes(status)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid task status",
            });
        }

        // Validate priority
        if (
            priority !== undefined &&
            !allowedPriorities.includes(priority)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid task priority",
            });
        }

        // Validate dates
        for (const [field, value] of [
            ["dueDate", dueDate],
            ["reminderAt", reminderAt],
        ]) {
            if (
                value !== undefined &&
                value !== null &&
                (
                    typeof value !== "string" ||
                    !Number.isFinite(Date.parse(value))
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid ${field}`,
                });
            }
        }

        // Validate notebook and tags
        const references = await validateReferences(
            req.user._id,
            notebookId,
            tags
        );

        if (typeof references === "string") {
            return res.status(400).json({
                success: false,
                message: references,
            });
        }

        const taskStatus = status || "pending";

        const task = await Task.create({
            userId: req.user._id,
            title: title.trim(),
            description,
            status: taskStatus,
            priority: priority || "medium",
            dueDate: dueDate || null,
            completedAt:
                taskStatus === "completed" ? new Date() : null,
            notebookId: notebookId || null,
            tags: references.tagIds || [],
            reminderAt: reminderAt || null,
        });

        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: task,
        });

    } catch (error) {
        console.error("Create task error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create task",
        });
    }
};


export const getAllTasks = async (req, res) => {
    try {
        const {
            status,
            priority,
            notebookId,
            tagId,
            search,
            from,
            to,
            sort = "newest",
            page = 1,
            limit = 10,
        } = req.query;

        // Validate filters
        if (
            status &&
            !allowedStatuses.includes(status)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid status filter",
            });
        }

        if (
            priority &&
            !allowedPriorities.includes(priority)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid priority filter",
            });
        }

        if (
            notebookId &&
            !mongoose.isValidObjectId(notebookId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid notebook ID",
            });
        }

        if (
            tagId &&
            !mongoose.isValidObjectId(tagId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid tag ID",
            });
        }

        // Validate date filters
        for (const [field, value] of [
            ["from", from],
            ["to", to],
        ]) {
            if (
                value &&
                !Number.isFinite(Date.parse(value))
            ) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid ${field} date`,
                });
            }
        }

        const pageNumber = Math.max(
            1,
            parseInt(page, 10) || 1
        );

        const limitNumber = Math.min(
            100,
            Math.max(1, parseInt(limit, 10) || 10)
        );

        const skip = (pageNumber - 1) * limitNumber;

        // Build query
        const filter = {
            userId: req.user._id,
        };

        if (status) filter.status = status;

        if (priority) filter.priority = priority;

        if (notebookId) {
            filter.notebookId = notebookId;
        }

        if (tagId) {
            filter.tags = tagId;
        }

        if (search?.trim()) {
            const escapedSearch = search
                .trim()
                .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            filter.title = {
                $regex: escapedSearch,
                $options: "i",
            };
        }

        if (from || to) {
            filter.dueDate = {};

            if (from) {
                filter.dueDate.$gte = new Date(from);
            }

            if (to) {
                filter.dueDate.$lte = new Date(to);
            }
        }

        // Sorting
        const sortOptions = {
            newest: { createdAt: -1 },
            oldest: { createdAt: 1 },
            dueDate: { dueDate: 1, createdAt: -1 },
            priority: { priority: -1, createdAt: -1 },
            updated: { updatedAt: -1 },
        };

        if (!sortOptions[sort]) {
            return res.status(400).json({
                success: false,
                message: "Invalid sorting option",
            });
        }

        const [tasks, totalTasks] = await Promise.all([
            Task.find(filter)
                .populate("notebookId", "name color")
                .populate("tags", "name color")
                .sort(sortOptions[sort])
                .skip(skip)
                .limit(limitNumber),

            Task.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,

            pagination: {
                currentPage: pageNumber,
                totalPages: Math.ceil(
                    totalTasks / limitNumber
                ),
                totalTasks,
                limit: limitNumber,
            },

            data: tasks,
        });

    } catch (error) {
        console.error("Get tasks error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve tasks",
        });
    }
};


export const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid task ID",
            });
        }

        const task = await Task.findOne({
            _id: id,
            userId: req.user._id,
        })
            .populate("notebookId", "name color")
            .populate("tags", "name color");

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: task,
        });

    } catch (error) {
        console.error("Get task error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve task",
        });
    }
};


export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            title,
            description,
            status,
            priority,
            dueDate,
            notebookId,
            tags,
            reminderAt,
        } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid task ID",
            });
        }

        const task = await Task.findOne({
            _id: id,
            userId: req.user._id,
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        const updates = {};

        if (title !== undefined) {
            if (
                typeof title !== "string" ||
                !title.trim() ||
                title.trim().length > 150
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid task title",
                });
            }

            updates.title = title.trim();
        }

        if (description !== undefined) {
            if (
                typeof description !== "string" ||
                description.length > 2000
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid task description",
                });
            }

            updates.description = description.trim();
        }

        if (status !== undefined) {
            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid task status",
                });
            }

            updates.status = status;

            updates.completedAt =
                status === "completed"
                    ? (task.status === "completed"
                        ? task.completedAt || new Date()
                        : new Date())
                    : null;
        }

        if (priority !== undefined) {
            if (!allowedPriorities.includes(priority)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid task priority",
                });
            }

            updates.priority = priority;
        }

        for (const [field, value] of [
            ["dueDate", dueDate],
            ["reminderAt", reminderAt],
        ]) {
            if (value !== undefined) {
                if (
                    value !== null &&
                    (
                        typeof value !== "string" ||
                        !Number.isFinite(Date.parse(value))
                    )
                ) {
                    return res.status(400).json({
                        success: false,
                        message: `Invalid ${field}`,
                    });
                }

                updates[field] = value === null
                    ? null
                    : new Date(value);
            }
        }

        if (notebookId !== undefined || tags !== undefined) {
            const references = await validateReferences(
                req.user._id,
                notebookId !== undefined
                    ? notebookId
                    : task.notebookId,
                tags !== undefined
                    ? tags
                    : task.tags
            );

            if (typeof references === "string") {
                return res.status(400).json({
                    success: false,
                    message: references,
                });
            }

            if (notebookId !== undefined) {
                updates.notebookId = notebookId || null;
            }

            if (tags !== undefined) {
                updates.tags = references.tagIds;
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid fields provided",
            });
        }

        Object.assign(task, updates);

        await task.save();

        await task.populate([
            { path: "notebookId", select: "name color" },
            { path: "tags", select: "name color" },
        ]);

        return res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: task,
        });

    } catch (error) {
        console.error("Update task error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update task",
        });
    }
};


export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid task ID",
            });
        }

        const task = await Task.findOneAndDelete({
            _id: id,
            userId: req.user._id,
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        });

    } catch (error) {
        console.error("Delete task error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete task",
        });
    }
};


export const completeTask = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid task ID",
            });
        }

        const task = await Task.findOne({
            _id: id,
            userId: req.user._id,
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        task.status = "completed";
        task.completedAt = new Date();

        await task.save();

        return res.status(200).json({
            success: true,
            message: "Task completed successfully",
            data: task,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to complete task",
        });
    }
};


export const reopenTask = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid task ID",
            });
        }

        const task = await Task.findOne({
            _id: id,
            userId: req.user._id,
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        task.status = "pending";
        task.completedAt = null;

        await task.save();

        return res.status(200).json({
            success: true,
            message: "Task reopened successfully",
            data: task,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to reopen task",
        });
    }
};


export const getTaskStats = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(
            req.user._id
        );

        const [stats] = await Task.aggregate([
            {
                $match: {
                    userId,
                },
            },
            {
                $group: {
                    _id: null,

                    totalTasks: {
                        $sum: 1,
                    },

                    pendingTasks: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "pending"] },
                                1,
                                0,
                            ],
                        },
                    },

                    inProgressTasks: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "in-progress"] },
                                1,
                                0,
                            ],
                        },
                    },

                    completedTasks: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "completed"] },
                                1,
                                0,
                            ],
                        },
                    },

                    highPriorityTasks: {
                        $sum: {
                            $cond: [
                                {
                                    $in: [
                                        "$priority",
                                        ["high", "urgent"],
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },

                    overdueTasks: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        {
                                            $lt: [
                                                "$dueDate",
                                                new Date(),
                                            ],
                                        },
                                        {
                                            $ne: ["$status", "completed"],
                                        },
                                        {
                                            $ne: ["$dueDate", null],
                                        },
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalTasks: 1,
                    pendingTasks: 1,
                    inProgressTasks: 1,
                    completedTasks: 1,
                    highPriorityTasks: 1,
                    overdueTasks: 1,

                    completionPercentage: {
                        $cond: [
                            { $eq: ["$totalTasks", 0] },
                            0,
                            {
                                $multiply: [
                                    {
                                        $divide: [
                                            "$completedTasks",
                                            "$totalTasks",
                                        ],
                                    },
                                    100,
                                ],
                            },
                        ],
                    },
                },
            },
        ]);

        return res.status(200).json({
            success: true,
            data: stats || {
                totalTasks: 0,
                pendingTasks: 0,
                inProgressTasks: 0,
                completedTasks: 0,
                highPriorityTasks: 0,
                overdueTasks: 0,
                completionPercentage: 0,
            },
        });

    } catch (error) {
        console.error("Task statistics error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve task statistics",
        });
    }
};
