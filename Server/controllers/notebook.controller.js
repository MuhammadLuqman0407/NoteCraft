import mongoose from "mongoose";

import Notebook from '../models/notebook.model.js';
import Note from '../models/note.model.js';


export const createNotebook = async (req, res) => {
    try {
        const { name, description, color, icon } = req.body;

        // Validate notebook name
        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Notebook name is required",
            });
        }

        // Validate name length
        if (name.trim().length > 80) {
            return res.status(400).json({
                success: false,
                message: "Notebook name cannot exceed 80 characters",
            });
        }

        // Validate color
        if (
            color !== undefined &&
            !/^#[0-9A-Fa-f]{6}$/.test(color)
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid hex color",
            });
        }

        // Check duplicate notebook
        const existingNotebook = await notebookModel.findOne({
            userId: req.user._id,
            name: name.trim(),
        });

        if (existingNotebook) {
            return res.status(409).json({
                success: false,
                message: "Notebook already exists",
            });
        }

        // Create notebook
        const notebook = await notebookModel.create({
            userId: req.user._id,
            name: name.trim(),
            description,
            color,
            icon,
        });

        res.status(201).json({
            success: true,
            message: "Notebook created successfully",
            data: notebook,
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Notebook name already exists",
            });
        }

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const getAllNotebooks = async (req, res) => {
    try {
        const notebooks = await Notebook.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(
                        req.user._id
                    ),
                },
            },

            {
                $lookup: {
                    from: "notes",
                    let: { notebookId: "$_id" },

                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: [
                                                "$notebookId",
                                                "$$notebookId",
                                            ],
                                        },
                                        {
                                            $eq: [
                                                "$userId",
                                                new mongoose.Types.ObjectId(
                                                    req.user._id
                                                ),
                                            ],
                                        },
                                        {
                                            $eq: ["$status", "active"],
                                        },
                                    ],
                                },
                            },
                        },
                        {
                            $count: "total",
                        },
                    ],

                    as: "noteCount",
                },
            },

            {
                $addFields: {
                    noteCount: {
                        $ifNull: [
                            { $arrayElemAt: ["$noteCount.total", 0] },
                            0,
                        ],
                    },
                },
            },

            {
                $sort: {
                    updatedAt: -1,
                },
            },
        ]);

        res.status(200).json({
            success: true,
            count: notebooks.length,
            data: notebooks,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const getNotebookById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ID
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid notebook ID",
            });
        }

        const notebook = await Notebook.findOne({
            _id: id,
            userId: req.user._id,
        });

        if (!notebook) {
            return res.status(404).json({
                success: false,
                message: "Notebook not found",
            });
        }

        res.status(200).json({
            success: true,
            data: notebook,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



export const updateNotebook = async (req, res) => {
    try {
        const { id } = req.params;

        const { name, description, color, icon } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid notebook ID",
            });
        }

        // Prepare updates
        const updates = {};

        if (name !== undefined) {
            if (
                typeof name !== "string" ||
                !name.trim() ||
                name.trim().length > 80
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Notebook name must be between 1 and 80 characters",
                });
            }

            updates.name = name.trim();
        }

        if (description !== undefined) {
            if (
                typeof description !== "string" ||
                description.length > 300
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid notebook description",
                });
            }

            updates.description = description.trim();
        }

        if (color !== undefined) {
            if (
                typeof color !== "string" ||
                !/^#[0-9A-Fa-f]{6}$/.test(color)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid notebook color",
                });
            }

            updates.color = color;
        }

        if (icon !== undefined) {
            if (
                typeof icon !== "string" ||
                !icon.trim() ||
                icon.length > 40
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid notebook icon",
                });
            }

            updates.icon = icon.trim();
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid fields provided for update",
            });
        }

        const notebook = await Notebook.findOneAndUpdate(
            {
                _id: id,
                userId: req.user._id,
            },
            {
                $set: updates,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!notebook) {
            return res.status(404).json({
                success: false,
                message: "Notebook not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Notebook updated successfully",
            data: notebook,
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Another notebook with this name already exists",
            });
        }

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const deleteNotebook = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid notebook ID",
            });
        }

        // Check notebook ownership
        const notebook = await Notebook.findOne({
            _id: id,
            userId: req.user._id,
        });

        if (!notebook) {
            return res.status(404).json({
                success: false,
                message: "Notebook not found",
            });
        }

        // Remove notebook reference from its notes
        await Note.updateMany(
            {
                notebookId: notebook._id,
                userId: req.user._id,
            },
            {
                $set: {
                    notebookId: null,
                },
            }
        );

        // Delete notebook
        await Notebook.deleteOne({
            _id: notebook._id,
            userId: req.user._id,
        });

        res.status(200).json({
            success: true,
            message: "Notebook deleted successfully. Its notes have been kept.",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const getNotebookNotes = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid notebook ID",
            });
        }

        // Verify notebook ownership
        const notebook = await Notebook.findOne({
            _id: id,
            userId: req.user._id,
        });

        if (!notebook) {
            return res.status(404).json({
                success: false,
                message: "Notebook not found",
            });
        }

        // Pagination
        const page = Math.max(
            1,
            parseInt(req.query.page, 10) || 1
        );

        const limit = Math.min(
            100,
            Math.max(1, parseInt(req.query.limit, 10) || 10)
        );

        const skip = (page - 1) * limit;

        // Find notebook notes
        const filter = {
            userId: req.user._id,
            notebookId: notebook._id,
            status: "active",
        };

        const [notes, totalNotes] = await Promise.all([
            Note.find(filter)
                .populate("tags", "name color")
                .populate("notebookId", "name color")
                .sort({ updatedAt: -1 })
                .skip(skip)
                .limit(limit),

            Note.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            notebook: {
                id: notebook._id,
                name: notebook.name,
                color: notebook.color,
            },
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalNotes / limit),
                totalNotes,
                limit,
            },
            data: notes,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const getNotebookStats = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid notebook ID",
            });
        }

        const notebook = await Notebook.findOne({
            _id: id,
            userId: req.user._id,
        });

        if (!notebook) {
            return res.status(404).json({
                success: false,
                message: "Notebook not found",
            });
        }

        const stats = await Note.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(
                        req.user._id
                    ),
                    notebookId: notebook._id,
                },
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        const counts = {
            active: 0,
            archived: 0,
            trash: 0,
        };

        stats.forEach((item) => {
            counts[item._id] = item.count;
        });

        res.status(200).json({
            success: true,
            data: {
                notebookId: notebook._id,
                notebookName: notebook.name,
                totalNotes:
                    counts.active +
                    counts.archived +
                    counts.trash,
                activeNotes: counts.active,
                archivedNotes: counts.archived,
                trashedNotes: counts.trash,
            },
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
