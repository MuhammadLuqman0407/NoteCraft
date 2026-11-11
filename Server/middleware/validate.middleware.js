
import mongoose from "mongoose";

// Validation middleware factory
export const validate = (schema) => {
    return (req, res, next) => {
        const errors = [];

        // Validate request body
        if (schema.body) {
            errors.push(
                ...schema.body(req.body || {})
            );
        }

        // Validate route parameters
        if (schema.params) {
            errors.push(
                ...schema.params(req.params || {})
            );
        }

        // Validate query parameters
        if (schema.query) {
            errors.push(
                ...schema.query(req.query || {})
            );
        }

        // Return validation errors
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors,
            });
        }

        next();
    };
};

// Reusable validation helpers
export const validators = {
    requiredString: (value, field, maxLength = 150) => {
        if (
            typeof value !== "string" ||
            !value.trim()
        ) {
            return `${field} is required`;
        }

        if (value.trim().length > maxLength) {
            return `${field} cannot exceed ${maxLength} characters`;
        }

        return null;
    },

    optionalString: (value, field, maxLength = 2000) => {
        if (value === undefined) return null;

        if (
            typeof value !== "string" ||
            value.length > maxLength
        ) {
            return `Invalid ${field}`;
        }

        return null;
    },

    email: (value) => {
        if (
            typeof value !== "string" ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ) {
            return "Valid email address is required";
        }

        return null;
    },

    objectId: (value, field = "ID") => {
        if (!mongoose.isValidObjectId(value)) {
            return `Invalid ${field}`;
        }

        return null;
    },

    enum: (value, field, allowedValues) => {
        if (!allowedValues.includes(value)) {
            return `Invalid ${field}. Allowed values: ${allowedValues.join(", ")}`;
        }

        return null;
    },

    array: (value, field) => {
        if (!Array.isArray(value)) {
            return `${field} must be an array`;
        }

        return null;
    },

    date: (value, field) => {
        if (
            value !== null &&
            (
                typeof value !== "string" ||
                !Number.isFinite(Date.parse(value))
            )
        ) {
            return `Invalid ${field}`;
        }

        return null;
    },
};

// Reusable ObjectId parameter validation
export const validateObjectId = (
    parameter = "id"
) => {
    return validate({
        params: (params) => {
            const error = validators.objectId(
                params[parameter],
                parameter
            );

            return error ? [error] : [];
        },
    });
};

// Validate request body is a non-array object
export const validateBody = (req, res, next) => {
    if (
        !req.body ||
        typeof req.body !== "object" ||
        Array.isArray(req.body)
    ) {
        return res.status(400).json({
            success: false,
            message: "Request body must be a valid JSON object",
        });
    }

    next();
};
