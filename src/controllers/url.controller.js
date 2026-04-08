import prisma from "../config/db.js";
import generateShortCode from "../utils/generateShortCode.js";
import ApiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const shortenUrl = asyncHandler(async (req, res) => {
    const { url } = req.body;

    if (!url) {
        throw new Error("URL is required");
    }

    const shortCode = generateShortCode();

    const newUrl = await prisma.url.create({
        data: {
            shortCode,
            longUrl: url
        }
    });

    return res.status(201).json(
        new ApiResponse(201, "Short URL created", newUrl)
    );
});

export { shortenUrl };