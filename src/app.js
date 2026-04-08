import express from "express";
import dotenv from "dotenv";
import ApiResponse from "./utils/apiResponse.js";
import errorMiddleware from "./middleware/error.middleware.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.status(200).json(
        new ApiResponse(200, "Welcome to URL Shortener API")
    );
});

// Error Middleware (must be last)
app.use(errorMiddleware);

export default app;