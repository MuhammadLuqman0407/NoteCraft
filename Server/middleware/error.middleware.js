
/**
 * NoteCraft - Global Error Middleware
 */

// Custom application error class
export class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);

        this.statusCode = statusCode;
        this.status = statusCode >= 500
            ? "error"
            : "fail";

        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Handle MongoDB duplicate key errors
const handleDuplicateKeyError = (error) => {
    const field = Object.keys(error.keyValue || {})[0];

    return new AppError(
        `${field || "Field"} already exists`,
        409
    );
};

// Handle Mongoose validation errors
const handleValidationError = (error) => {
    const messages = Object.values(error.errors).map(
        (item) => item.message
    );

    return new AppError(
        messages.join(", "),
        400
    );
};

// Handle invalid MongoDB ObjectId
const handleCastError = () => {
    return new AppError(
        "Invalid resource ID",
        400
    );
};

// Handle JWT errors
const handleJWTError = () => {
    return new AppError(
        "Invalid authentication token. Please login again",
        401
    );
};

// Handle expired JWT
const handleJWTExpiredError = () => {
    return new AppError(
        "Your session has expired. Please login again",
        401
    );
};

// Global error handler
export const errorHandler = (
    error,
    req,
    res,
    next
) => {
    let err = error;

    if (error.code === 11000) {
        err = handleDuplicateKeyError(error);
    }

    if (error.name === "ValidationError") {
        err = handleValidationError(error);
    }

    if (error.name === "CastError") {
        err = handleCastError(error);
    }

    if (error.name === "JsonWebTokenError") {
        err = handleJWTError();
    }

    if (error.name === "TokenExpiredError") {
        err = handleJWTExpiredError();
    }

    const statusCode = err.statusCode || 500;

    // Log errors for development
    if (process.env.NODE_ENV !== "production") {
        console.error("ERROR:", error);
    }

    return res.status(statusCode).json({
        success: false,
        status: err.status || "error",
        message:
            err.isOperational
                ? err.message
                : statusCode === 500
                    ? "Internal server error"
                    : err.message,
        ...(process.env.NODE_ENV !== "production" && {
            stack: error.stack,
        }),
    });
};

// Handle undefined API routes
export const notFound = (req, res, next) => {
    const error = new AppError(
        `Route not found: ${req.method} ${req.originalUrl}`,
        404
    );

    next(error);
};
