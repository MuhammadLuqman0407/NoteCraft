
import jwt from "jsonwebtoken";

import User from "../models/User.js";

export const protect = async (req, res, next) => {
    try {
        let token;

        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (
            authHeader &&
            authHeader.startsWith("Bearer ")
        ) {
            token = authHeader.split(" ")[1];
        }

        // Check token existence
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. Please login first.",
            });
        }

        // Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Find authenticated user
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User no longer exists",
            });
        }

        // Check account status
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account is disabled",
            });
        }

        // Attach user to request
        req.user = user;

        // Continue to controller
        next();

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Session expired. Please login again.",
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication token",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Authentication failed",
        });
    }
};
