import Note from '../models/note.model.js';

// 1 -> CREATE NOTE
export const createNote = async (req, res) => {
    try {
        const { title, content, tags, notebookId } = req.body;

        const note = await Note.create({
            userId: req.user.id,
            title,
            content,
            tags,
            notebookId,
        });

        res.status(201).json({
            success: true,
            message: "Note created successfully",
            data: note,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// 2 -> Get all Notes
export const getAllNotes = async (req, res) => {
    try {
        const mptes = await Note.find({
            userId: req.user.id,
            status: "active",
        })
            .populate("tags", "name color")
            .populate("notebookId", "name color")
            .sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            count: notes.length,
            data: notes,
        });

    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// 3 -> Get Notes by Id
export const getNoteById = async (req, res) => {
    try {
        const note = await Note.findOne({
            _id: req.params.id,
            userId: req.user.id,
        })
            .populate("tags", "name color")
            .populate("notebookId", "name color");

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found",
            });
        }

        res.status(200).json({
            success: true,
            data: note,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// 4 -> Update Note
export const updateNote = async (req, res) => {
    try {
        const { title, content, tags, notebookId } = req.body;

        const note = await Note.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.id,
                status: "active",
            },
            {
                title,
                content,
                tags,
                notebookId,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Note updated successfully",
            data: note,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// 5 -> Delete Note (Moves to Trash)
export const deleteNote = async (req, res) => {
    try {
        const note = await Note.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.id,
                status: { $ne: "trash" },
            },
            {
                status: "trash",
                trashedAt: new Date(),
            },
            {
                new: true,
            }
        );

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Note moved to trash",
            data: note,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};