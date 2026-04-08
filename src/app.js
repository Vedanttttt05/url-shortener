import express from "express";
import dotenv from "dotenv";
import ApiResponse  from "./utils/apiResponse.js";
dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json(new ApiResponse(200, "Welcome to URL Shortener API", null) );
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});