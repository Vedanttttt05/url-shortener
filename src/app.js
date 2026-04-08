import dotenv from "dotenv";
dotenv.config();
import express from "express";
import ApiResponse from "./utils/apiResponse.js";
import errorMiddleware from "./middleware/error.middleware.js";
import redis from "./config/redis.js";




const app = express();

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.status(200).json(
        new ApiResponse(200, "Welcome to URL Shortener API")
    );
});

// api ROUTES
import urlRoutes from "./routes/url.routes.js";
import redirectRoutes from "./routes/redirect.routes.js";


app.get("/redis-test", async (req, res) => {
  await redis.set("test", "Hello Redis");
  const value = await redis.get("test");

  res.json({ value });
});

app.use("/", redirectRoutes);
app.use("/api/v1/url", urlRoutes);

// Error Middleware (must be last)
app.use(errorMiddleware);

export default app;