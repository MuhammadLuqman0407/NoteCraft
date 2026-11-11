import mongoose from "mongoose";

import Tag from "../models/tag.model.js";
import Note from "../models/note.model.js";


export const createTag = async (req, res) => {
    try {
        const { name, color } = req.body;

        // Validate tag name
        if (
            typeof name !== "string" ||
            !name.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Tag name is required",
            });
        }

        const trimmedName = name.trim();

        if (trimmedName.length > 40) {
            return res.status(400).json({
                success: false,
                message: "Tag name cannot exceed 40 characters",
            });
        }

        // Validate color
        if (
            color !== undefined &&
            (
                typeof color !== "string" ||
                !/^#[0-9A-Fa-f]{6}$/.test(color)
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid hex color",
            });
        }

        const normalizedName = trimmedName.toLowerCase();

        // Check duplicate tag
        const existingTag = await Tag.findOne({
            userId: req.user._id,
            normalizedName,
        });

        if (existingTag) {
            return res.status(409).json({
                success: false,
                message: "Tag already exists",
            });
        }

        // Create tag
        const tag = await Tag.create({
            userId: req.user._id,
            name: trimmedName,
            normalizedName,
            color: color || "#F97316",
        });

        return res.status(201).json({
            success: true,
            message: "Tag created successfully",
            data: tag,
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Tag already exists",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create tag",
        });
    }
};



export const getAllTags = async (req, res) => {
    try {
        const tags = await Tag.aggregate([
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
                    let: {
                        tagId: "$_id",
                        ownerId: "$userId",
                    },

                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $in: [
                                                "$$tagId",
                                                { $ifNull: ["$tags", []] },
                                            ],
                                        },
                                        {
                                            $eq: ["$userId", "$$ownerId"],
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

                    as: "usage",
                },
            },

            {
                $addFields: {
                    noteCount: {
                        $ifNull: [
                            { $arrayElemAt: ["$usage.total", 0] },
                            0,
                        ],
                    },
                },
            },

            {
                $project: {
                    usage: 0,
                },
            },

            {
                $sort: {
                    name: 1,
                },
            },
        ]);

        return res.status(200).json({
            success: true,
            count: tags.length,
            data: tags,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve tags",
        });
    }
};


export const getTagById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid tag ID",
            });
        }

        const tag = await Tag.findOne({
            _id: id,
            userId: req.user._id,
        });

        if (!tag) {
            return res.status(404).json({
                success: false,
                message: "Tag not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: tag,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve tag",
        });
    }
};


export const updateTag = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, color } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid tag ID",
            });
        }

        const updates = {};

        // Validate and update name
        if (name !== undefined) {
            if (
                typeof name !== "string" ||
                !name.trim() ||
                name.trim().length > 40
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Tag name must be between 1 and 40 characters",
                });
            }

            updates.name = name.trim();
            updates.normalizedName = name.trim().toLowerCase();
        }

        // Validate and update color
        if (color !== undefined) {
            if (
                typeof color !== "string" ||
                !/^#[0-9A-Fa-f]{6}$/.test(color)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid tag color",
                });
            }

            updates.color = color;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide a name or color to update",
            });
        }

        const tag = await Tag.findOneAndUpdate(
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

        if (!tag) {
            return res.status(404).json({
                success: false,
                message: "Tag not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Tag updated successfully",
            data: tag,
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Another tag with this name already exists",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update tag",
        });
    }
};


export const deleteTag = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid tag ID",
            });
        }

        // Verify ownership
        const tag = await Tag.findOne({
            _id: id,
            userId: req.user._id,
        });

        if (!tag) {
            return res.status(404).json({
                success: false,
                message: "Tag not found",
            });
        }

        // Remove tag reference from user's notes
        await Note.updateMany(
            {
                userId: req.user._id,
                tags: tag._id,
            },
            {
                $pull: {
                    tags: tag._id,
                },
            }
        );

        // Delete tag
        await Tag.deleteOne({
            _id: tag._id,
            userId: req.user._id,
        });

        return res.status(200).json({
            success: true,
            message: "Tag deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete tag",
        });
    }
};


export const getTagNotes = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid tag ID",
            });
        }

        // Check tag ownership
        const tag = await Tag.findOne({
            _id: id,
            userId: req.user._id,
        });

        if (!tag) {
            return res.status(404).json({
                success: false,
                message: "Tag not found",
            });
        }

        // Pagination
        const page = Math.max(
            1,
            parseInt(req.query.page, 10) || 1
        );

        const limit = Math.min(
            100,
            Math.max(
                1,
                parseInt(req.query.limit, 10) || 10
            )
        );

        const skip = (page - 1) * limit;

        // Find notes associated with tag
        const filter = {
            userId: req.user._id,
            tags: tag._id,
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

        return res.status(200).json({
            success: true,

            tag: {
                id: tag._id,
                name: tag.name,
                color: tag.color,
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
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve tag notes",
        });
    }
};


export const getTagStats = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid tag ID",
            });
        }

        const tag = await Tag.findOne({
            _id: id,
            userId: req.user._id,
        });

        if (!tag) {
            return res.status(404).json({
                success: false,
                message: "Tag not found",
            });
        }

        const stats = await Note.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(
                        req.user._id
                    ),
                    tags: tag._id,
                },
            },

            {
                $group: {
                    _id: "$status",
                    count: {
                        $sum: 1,
                    },
                },
            },
        ]);

        const counts = {
            active: 0,
            archived: 0,
            trash: 0,
        };

        stats.forEach((item) => {
            if (Object.hasOwn(counts, item._id)) {
                counts[item._id] = item.count;
            }
        });

        return res.status(200).json({
            success: true,

            data: {
                tagId: tag._id,
                tagName: tag.name,

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
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve tag statistics",
        });
    }
};
